// Actually we should make this a class that can return a dataset by handle,
// so that we can just refer to the handles in the vis components.
// Also need ability to get all. Maybe just have this be part of the constructor
// for this class.

var now = new Date();
var month = ("0" + (now.getMonth() + 1)).slice(-2);
var day = ("0" + now.getDate()).slice(-2);
var years = [now.getFullYear()-1, now.getFullYear()];

var datasets = [
  {
    tag: 'active-permits',
    source_type: 'arcgis-rest',
    dataset_type: 'table',
    /******* ProjectCommentary *********
      I've hard-coded the _where_ clause here and included only one other ArcGIS
      REST parameter that I thought I might actually use. In a production version,
      all API options would be configurable and we'd want to allow some sort of parameterized
      form of the _where_ clause that at least allowed the dates to be computed dynamically.
    */
    query: {
      maxRecordCount: 1000, // Not sure this belongs here, need to think how to generalize
      url: 'http://arcgis.ashevillenc.gov/arcgis/rest/services/Permits/AshevillePermits/MapServer/0/query',
      where: `(record_status_date > date '${years[0]}-${month}-${day}' AND ` +
             ` record_status_date <= date '${years[1]}-${month}-${day}')`,
      returnGeometry: true
    },
    /******* ProjectCommentary *********
      I'm not using the configuration here, but it might be a place to add things
      like standard transforms, etc. For example, you might want to add a computed
      column for the percentage change between 2 other columns - that's the
      kind of thing that should be doable without coding.
    */
    configuration: null
  }
];

export default datasets;
