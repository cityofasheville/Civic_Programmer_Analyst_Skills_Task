import fetch from 'isomorphic-fetch'
import * as actionTypes from './ActionTypes';
import { setErrorMessage } from './CommonActions'

// This is a sample data set with ~100 records. Set simulateApi to true
// to use instead of actual REST API calls
import sampleData from './sampleData';

// A bit ugly, but we'll just hardcode for now.
function createArcGISUrl(dataset, doCountOnly, offset, count) {
  const q = dataset.query;
  let url = q.url + `?where=${encodeURIComponent(q.where)}&text=&objectIds=&time=&geometry=`;
  url += "&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects";
  url += "&relationParam="
  url += `&outFields=${q.fields}`;
  url += `&returnGeometry=${q.returnGeometry?"true":"false"}&returnTrueCurves=false`;
  url += "&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false";
  url += `&returnCountOnly=${doCountOnly?"true":"false"}`;
  url += "&orderByFields=&groupByFieldsForStatistics=&outStatistics=";
  url += "&returnZ=false&returnM=false&gdbVersion="
  url += `&returnDistinctValues=${q.returnGeometry?"false":"true"}`;
  url += `&resultOffset=${(offset < 0)?"":offset}&resultRecordCount=${(count > 0)?count:""}&f=json`;
  return url;
}

// FIXTHIS if production:
//  This should be driven by the query.fields configuration parameter.
function transformRecord(inR0, usingBackupServer) {
  // The SimpliCity API puts attributes in a sub-object.
  let inR = usingBackupServer?inR0.attributes:inR0;
  let record = {
    name: inR.record_name,
    date_opened: inR.date_opened,
    record_status: inR.record_status,
    record_status_date: inR.record_status_date,
    record_type_group: inR.record_type_group,
    record_type_type: inR.record_type_type,
    record_type_category: inR.record_type_category,
    record_type: inR.record_type,
    record_type_subtype: inR.record_type_subtype,
    latitude: inR.latitude,
    longitude: inR.longitude
  };
  return record;
}

function loadSampleData (dataset, inputData, dispatch) {
  const data = inputData.features.map((item) => {
    return transformRecord(item, false);
  });
  dispatch({type: actionTypes.UPDATE_DATASET, data: {
    tag: dataset.tag,
    operation: 'finish',
    items: data
  }});
}

function doFakeFetch (dataset, dispatch, maxRecordCount, count) {
  dispatch({type: actionTypes.UPDATE_DATASET, data: {
    tag: dataset.tag,
    operation: 'count',
    count: sampleData.features.length
  }});
  console.log("We a got a count a " + sampleData.features.length);
  // Add a short delay to simulate actual load time
  setTimeout (loadSampleData.bind(null, dataset, sampleData, dispatch), 3000);
}

function doApiFetch (dataset, dispatch, maxRecordCount, count) {
  // Initial call gets the expected record count so we could keep the user informed
  // as to where we are in the process. Except that right now the API is returning
  // more than expected, so not trying to tell the user about it yet.
  let url, initialCall = (count < 0);
  if (initialCall)
    url = createArcGISUrl(dataset, true, count, maxRecordCount);
  else
    url = createArcGISUrl(dataset, false, count, maxRecordCount);
  console.log(`Fetch with offset = ${count}, URL: ${url}`);
  return fetch(url, {method: 'get', timeout: 15000})
    .then ((response ) => { return response.json(); })
    .then ((json) => {
      if (json.error != undefined) {
        throw json.error.message;
      }
      else {
        if (json.features == undefined) {
          if (json.count != undefined) {
            console.log("Got a count of " + json.count);
            dispatch({type: actionTypes.UPDATE_DATASET, data: {
              tag: dataset.tag,
              operation: 'count',
              count: json.count
            }});
            return doApiFetch(dataset, dispatch, maxRecordCount, 0);
          }
          else {
            // I guess we're done, right?
            dispatch({type: actionTypes.UPDATE_DATASET, data: {
              tag: dataset.tag,
              operation: 'finish',
              items: []
            }});
            return Promise.resolve(true);
          }
        }
        else {
          const maxRecords = 30000; // DEBUG
          console.log("Received records of length " + json.features.length);
          const done = json.features.length < maxRecordCount || count >= maxRecords;
          const data = json.features.map( (item) => {
            return transformRecord(item, dataset.query.usingBackupServer);
          });

          dispatch({type: actionTypes.UPDATE_DATASET, data: {
            tag: dataset.tag,
            operation: done?'finish':'add',
            items: data
          }});
          if (!done) { // Request again
            return doApiFetch(dataset, dispatch, maxRecordCount, count + json.features.length);
          }
          else {
            return Promise.resolve(true); // We're done.
          }
        }
      }
    })
    .catch( (error) => {
      console.log('Fetch Error :-S', error);
      dispatch(setErrorMessage('Error fetching ArcGIS REST API dataset: ' + error));
      dispatch({type: actionTypes.UPDATE_DATASET, data: {
        tag: dataset.tag,
        operation: 'error',
        error
      }});
    });
}

///////////////////////////////////////////////////////////////////
// Note for the future:
//  I've got a lot of hardcoded stuff in this file. In a real
//  version, we'd break out a set of different loaders and make
//  them all configurable.
///////////////////////////////////////////////////////////////////

export function fetchDataset(dataset, dispatch) {
  dispatch ({ type: actionTypes.FETCH_DATASET, data: { dataset } }); // Just registers the dataset

  if (dataset.source_type == 'arcgis-rest') {
    const maxRecordCount = dataset.query.maxRecordCount;
    if (dataset.simulate_api) {
      return doFakeFetch (dataset, dispatch, maxRecordCount, -1);
    }
    else {
      return doApiFetch(dataset, dispatch, maxRecordCount, -1);
    }
  }
}
