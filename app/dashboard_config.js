//////////////////////////////
// Some setup
//////////////////////////////

var now = new Date();
var month = ("0" + (now.getMonth() + 1)).slice(-2);
var day = ("0" + now.getDate()).slice(-2);
var years = [now.getFullYear()-1, now.getFullYear()];

var simulateApi = false;
var useBackupServer = true; // Uses the AWS server that SimpliCity uses
var useAttributes = false;
var main_url = null;
if (useBackupServer) {
  main_url = 'http://arcgis-arcgisserver1-1222684815.us-east-1.elb.amazonaws.com/arcgis/rest/services/opendata/FeatureServer/1/query';
  useAttributes = true; // There are a few format differences on this server
}
else {
  main_url = 'http://arcgis.ashevillenc.gov/arcgis/rest/services/Permits/AshevillePermits/MapServer/0/query';
}

//////////////////////////////
// The configuration
//////////////////////////////

var config = {
  title: "City of Asheville Permits Dataset",
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
    tag: 'active-permits',      // Allow for possibility of multiple datasets
    source_type: 'arcgis-rest', // Could have loaders for different source types
    simulate_api: simulateApi,  // Just a hack for development

    ///////////////////////////////////////////////////////////////////
    // Query specification:
    //  In a production version, we'd make all API options configurable
    //  and have some sort of parameterized form of the _where_ clause
    //  that at least allowed dates to be computed dynamically.
    ///////////////////////////////////////////////////////////////////

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
    }
  },

  ///////////////////////////////////////////////////////////////////
  // Page filters specification:
  //  This is used to create the sets of buttons at the top of the
  //  page that let the user filter the exploration dataset. There
  //  is obviously limited room for these button sets, so only a
  //  couple should be included.
  //
  //  Each button implements a filter. If null, no filtering on the
  //  field is applied. If _include_ is true, the filter lists all
  //  values that should be included. If _include_ is false, the
  //  filter lists all values that should be excluded (which is how
  //  the "Other" filter is implemented below).
  ///////////////////////////////////////////////////////////////////

  pagefilters: [
    {
      field: 'record_type_group',
      name: 'Major Type',
      include_all_button: true,
      buttons: [
        {name: "All", filter: [], include: true},
        {name: "Construction", filter: ["Construction"], include: true},
        {name: "Planning", filter: ["Planning"], include: true},
        {name: "Enforcement", filter: ["Enforcement"], include: true}
      ]
    },
    {
      field: 'record_type_type',
      name: "Primary Category",
      include_all_button: true,
      buttons: [
        {name: "All", filter: [], include: true},
        {name: "Commercial", filter: ["Commercial"], include: true},
        {name: "Residential", filter: ["Residential"], include: true},
        {name: "Other", filter: ["Commercial", "Residential"], include: false}
      ]
    }
  ],

  ///////////////////////////////////////////////////////////////////
  // Attributes specification:
  //  This is primarily used to drive the _Key Dataset Information_
  //  section, although the display names could be used in other
  //  places.
  //
  //  The _expandable_ attribute lets the user expand the attribute
  //  description to see up to _max_attribute_values_to_show_ values
  //  in order of descending use frequency.
  ///////////////////////////////////////////////////////////////////

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
  ],

  ///////////////////////////////////////////////////////////////////
  // Quickview specification:
  //  This is primarily used to drive the _Key Dataset Information_
  //  section, although the display names could be used in other
  //  places.
  //
  //  The _expandable_ attribute lets the user expand the attribute
  //  description to see up to _max_attribute_values_to_show_ values
  //  in order of descending use frequency.
  ///////////////////////////////////////////////////////////////////

  quickview: [
    {
      title: "Past Year Activity By Month",
      type: "bar",
      transform: {
        type: "count_by_field",
        field: "record_status_date",
        field_type: "date",
        period: "month"
      }
    },
    {
      title: "Top Status Values",
      type: "pie",
      transform: {
        type: "count_by_field",
        field: "record_status",
        field_type: "string",
        max_values: 6
      }
    },
    {
      title: "Top Work Type Values",
      type: "pie",
      transform: {
        type: "count_by_field",
        field: "record_type",
        field_type: "string",
        max_values: 6
      }
    }

  ]
};

export default config;
