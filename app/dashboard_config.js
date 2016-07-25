// Actually we should make this a class that can return a dataset by handle,
// so that we can just refer to the handles in the vis components.
// Also need ability to get all. Maybe just have this be part of the constructor
// for this class.

var now = new Date();
var month = ("0" + (now.getMonth() + 1)).slice(-2);
var day = ("0" + now.getDate()).slice(-2);
var years = [now.getFullYear()-1, now.getFullYear()];

var simulateApi = false;
var useBackupServer = true;
var useAttributes = false;
var main_url = null;
if (useBackupServer) {
  main_url = 'http://arcgis-arcgisserver1-1222684815.us-east-1.elb.amazonaws.com/arcgis/rest/services/opendata/FeatureServer/1/query';
  useAttributes = true;
}
else {
  main_url = 'http://arcgis.ashevillenc.gov/arcgis/rest/services/Permits/AshevillePermits/MapServer/0/query';
}

var config = {
  title: "City of Asheville Permits Dashboard",
  description: "The full data set includes all building permit activity in the " +
                "City of Asheville from 2000 to the present and includes " +
                "planning permits, building construction permits, and " +
                "code enforcement permits. Please note that the City of " +
                "Asheville launched a new permitting system in November 2013. " +
                "Consequently, there are inherent differences between " +
                "records before and after the launch of the new permitting software.",
  dataset_url: "http://data.ashevillenc.gov/datasets/0b8ff99cce324fb58c81d5433ae883cf_0",
  explore_title: "Explore Permits Active in the Past Year",
  dataset: {
    tag: 'active-permits',
    source_type: 'arcgis-rest',
    dataset_type: 'table',
    simulate_api: simulateApi,
    /******* ProjectCommentary *********
      I've hard-coded the _where_ clause here and included only one other ArcGIS
      REST parameter that I thought I might actually use. In a production version,
      all API options would be configurable and we'd want to allow some sort of parameterized
      form of the _where_ clause that at least allowed the dates to be computed dynamically.
    */
    query: {
      maxRecordCount: 1000, // Not sure this belongs here, need to think how to generalize
      url: main_url,
      use_attributes: useAttributes, // false for the simulated or first url, true for the second.
      fields:  "date_opened,record_status,record_status_date,"
              + "record_type,record_type_group,record_type_category,record_type_type,"
              + "record_type_subtype,latitude,longitude",
      where: `(record_status_date > date '${years[0]}-${month}-${day}' AND ` +
             ` record_status_date <= date '${years[1]}-${month}-${day}')`,
      returnGeometry: false
    },
    max_attribute_values_to_show: 50,
    attributes: [
      {
        name: "date_opened",
        display: "Date Opened",
        description: "The date the permit was first opened.",
        expandable: false
      },
      {
        name: "record_status",
        display: "Status",
        description: "Current status of the permit.",
        expandable: true
      },
      {
        name: "record_status_date",
        display: "State Date",
        description: "The date the permit status was last updated.",
        expandable: false
      },
      {
        name: "record_type_group",
        display: "Major Type",
        description: "Top-level type indicating whether the permit is for " +
                     "construction ('Permits'), planning ('Planning') or " +
                     "enforcement ('Services'). ",
        expandable: true
      },
      {
        name: "record_type_type",
        display: "Primary Category",
        description: "High-level category of the permit, e.g., residential, commercial, etc.",
        expandable: true
      },
      {
        name: "record_type_subtype",
        display: "Secondary Category",
        description: "Sub-category of the permit, e.g., trade, existing building, new building, etc..",
        expandable: true
      },
      {
        name: "record_type",
        display: "Work Type",
        description: "General class of work to be performed under the permit.",
        expandable: true
      },
      {
        name: "record_name",
        display: "Name",
        description: "Name of the person or entity to whom the permit was issued.",
        expandable: false
      },
      {
        name: "record_address",
        display: "Address",
        description: "Address for which the permit was issued.",
        expandable: false
      },
      {
        name: "record_description",
        display: "Description",
        description: "Narrative description of the permit circumstances.",
        expandable: false
      },
      {
        name: "latitude",
        display: "Latitude",
        description: "The latitude of the permitted location.",
        expandable: false
      },
      {
        name: "longitude",
        display: "Longitude",
        description: "The longitude of the permitted location.",
        expandable: false
      }
    ]
  }
};

export default config;
