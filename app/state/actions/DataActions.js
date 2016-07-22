import fetch from 'isomorphic-fetch'
import * as actionTypes from './ActionTypes';
import { setErrorMessage } from './CommonActions'

// A bit ugly, but we'll just hardcode for now.
function createArcGISUrl(dataset, doCountOnly, offset, count) {
  const fields = "record_name,date_opened,record_module,record_status,record_status_date,"
               + "record_type,record_type_group,record_type_category,record_type_type,"
               + "record_type_subtype,status,latitude,longitude";
  const q = dataset.query;
  let url = q.url + `?where=${encodeURIComponent(q.where)}&text=&objectIds=&time=&geometry=`;
  url += "&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects";
  url += "&relationParam="
  url += `&outFields=${fields}`;
  url += `&returnGeometry=${q.returnGeometry?"true":"false"}&returnTrueCurves=false`;
  url += "&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false";
  url += `&returnCountOnly=${doCountOnly?"true":"false"}`;
  url += "&orderByFields=&groupByFieldsForStatistics=&outStatistics=";
  url += "&returnZ=false&returnM=false&gdbVersion="
  url += `&returnDistinctValues=${q.returnGeometry?"false":"true"}`;
  url += `&resultOffset=${(offset < 0)?"":offset}&resultRecordCount=${(count > 0)?count:""}&f=json`;
  return url;
}

function doApiFetch (dataset, dispatch, maxRecordCount, count) {
  // Initial call gets the expected record count so that we can keep the user informed
  // as to what's happening.
  let url, initialCall = (count < 0);
  if (initialCall)
    url = createArcGISUrl(dataset, true, count, maxRecordCount);
  else
    url = createArcGISUrl(dataset, false, count, maxRecordCount);
  console.log(`Fetch with offset = ${count}, URL: ${url}`);
  return fetch(url, {method: 'get', timeout: 30000})
    .then ((response ) => { return response.json(); })
    .then ((json) => {
      if (json.error != undefined) {
        throw json.error.message;
      }
      else {
        if (json.features == undefined) {
          if (json.count != undefined) {
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
          const maxRecords = 2000; // DEBUG
          let done = json.features.length < maxRecordCount || count >= maxRecords;
          dispatch({type: actionTypes.UPDATE_DATASET, data: {
            tag: dataset.tag,
            operation: done?'finish':'add',
            items: json.features
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

export function fetchDataset(dataset, dispatch) {
  dispatch ({ type: actionTypes.FETCH_DATASET, data: { dataset } }); // Just registers the dataset

  /******* ProjectCommentary *********
      I am constructing the query here for this test project, however,
      in a production version we'd probably have a set of dataloader helpers
      that were invoked based on the dataset source_type that also understood how
      to process different dataset_types for use here.
  */

  if (dataset.source_type == 'arcgis-rest') {
    const maxRecordCount = dataset.query.maxRecordCount;
    // Maybe do config object rather than args here??????????
    return doApiFetch(dataset, dispatch, maxRecordCount, -1);
  }
}
