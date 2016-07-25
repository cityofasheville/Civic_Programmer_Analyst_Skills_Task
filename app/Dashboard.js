import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {store} from 'redux';
import {autobind} from 'core-decorators'
import {fetchDataset} from './state/actions/DataActions';
import ToggleButtonSet from './components/ToggleButtonSet';
import PieChart from "./components/PieChart.js";
import BarChart from "./components/BarChart.js";

export default class Dashboard extends React.Component {
  // name: inR.record_name,
  // date_opened: inR.date_opened,
  // status: inR.record_status,
  // record_status_date: inR.record_status_date,
  // group: translateModule(inR.record_type_group),
  // permit_type: inR.record_type_type,
  // category: inR.record_type_category,
  // work_type: inR.record_type,
  // work_subtype: inR.record_type_subtype,

  constructor(props) {
    super(props);
    let filters = {
      record_status: [],
      record_type_group: [],
      record_type_type: [],
      record_type_category: [],
      record_type: [],
      record_type_subtype: []
    }
    this.state = {
      filters,
      attVisible: {}
    };
  }

  componentWillMount() {
    fetchDataset(this.props.config.dataset, this.props.dispatch);
  }
  /*
    These appear to be good options for charts:
      - http://www.reactd3.org/
      - https://github.com/rma-consulting/react-easy-chart
  */

  filterDataset (ds0, filter, include) {
    let ds = {...ds0};
    if (include) {
      ds.items = ds0.items.filter( (object) => {
        let keep = true;
        for (let key in filter) {
          if (filter[key].length <= 0) continue; // Nothing to filter
          keep = filter[key].some( (val) => {
            return (object[key] == val);
          }); // Throw out if it matches any value
          if (!keep) return keep;
        }
        return keep;
      }, this);
      console.log("Post-filter length: " + ds.items.length);
    }
    else {
      ds.items = ds0.items.filter( (object) => {
        let keep = true;
        for (let key in filter) {
          if (filter[key].length <= 0) continue; // Nothing to filter
          keep = filter[key].every( (val) => {
            return (object[key] != val);
          }); // Throw out if it matches any value
          if (!keep) return keep;
        }
        return keep;
      }, this);
      console.log("Post-filter length: " + ds.items.length);
    }
    return ds;
  }

  setFilter(field, value) {
    console.log("Set filter with field " + field + ", value " + JSON.stringify(value));
    let filters = {...this.state.filters};
    filters[field] = value;
    this.setState({filters: filters});
  }

  groupButtonOptions (field) {
    const fmap = {Construction: 1, Planning: 2, Enforcement: 3};
    let index = (fmap[this.state.filters[field]] || 0);
    return (
      [
        {name: "All", active: index == 0, action: this.setFilter.bind(this, field, [])},
        {name: "Construction", active: index == 1, action: this.setFilter.bind(this,field,["Construction"])},
        {name: "Planning", active: index == 2, action:this.setFilter.bind(this,field,["Planning"])},
        {name: "Enforcement", active: index == 3, action:this.setFilter.bind(this,field,["Enforcement"])}
      ]
    );
  }

  typeButtonOptions (field, names, values) {
    return (
      [
        {name: "All", active: true, action:undefined},
        {name: "Commercial", active: false, action: undefined},
        {name: "Residential", active: false, action:undefined},
        {name: "Other", active: false, action:undefined}
      ]
    );
  }

  groupByMonth (input, field, use_attributes) {
    let monthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let counter = 0;
    let errCount = 0;
    input.forEach( (r) => {
      let month = 0;
      ++counter;
      try {
        let d;
        if (use_attributes) {
          d = new Date(r[field] + 0);
        }
        else {
          d = new Date(Date.parse(r[field])); // this is the date.
        }
        month = d.getMonth();
      }
      catch (err) {
        if (errCount < 20) console.log("Error in groupByMonth" + r[field]);
        ++errCount;
        month = 0; // We'll just let the month be 0 for now.
      }
      monthlyData[month] += 1;
    });
    return monthlyData;
  }

  groupByField (input, field, maxCategories) {
    let data = [];
    let cmap = {}
    input.forEach( (r) => {
      if (!(r[field] in cmap)) {
        cmap[r[field]] = 1;
      }
      else {
        cmap[r[field]] += 1;
      }
    });
    let list = [];
    for (let key in cmap) {
      list.push({key: key, value: cmap[key]});
    }
    list.sort( (a, b) => {
      return (a.value<b.value)?1:((a.value>b.value)?-1:0);
    });
    let shortList = list.slice(0,maxCategories);
    let otherTotal = 0;
    list.slice(maxCategories).forEach((item)=> {
      otherTotal += item.value;
    });
    if (otherTotal > 0) {
      shortList.push({key: "Other", value: otherTotal});
    }
    //console.log("Short list is " + JSON.stringify(shortList));
    return shortList;
  }

  @autobind
  showValues(e) {
    const id = e.currentTarget.id.substring(4);
    let attVisible = {...this.state.attVisible};
    attVisible[id] = true;
    this.setState({attVisible});
    console.log("I did it " + id);
  }

  @autobind
  unShowValues(e) {
    const id = e.currentTarget.id.substring(4);
    let attVisible = {...this.state.attVisible};
    attVisible[id] = false;
    this.setState({attVisible});
    console.log("I did it " + id);
  }

  generateAttValuesList(key, input, maxValues) {
    console.log("ATT - key = " + key + " and maxValues = " + maxValues);
    let cmap = {};
    input.forEach( (r) => {
      if (!(r[key] in cmap)) {
        cmap[r[key]] = 1;
      }
      else {
        cmap[r[key]] += 1;
      }
    });
    let list = [];
    for (let key in cmap) {
      list.push({key: key, value: cmap[key]});
    }
    console.log("The initial list length is " + list.length);
    list.sort( (a, b) => {
      return (a.value<b.value)?1:((a.value>b.value)?-1:0);
    });
    let shortList = list.slice(0,maxValues);
    let otherTotal = 0;
    let otherCount = 0;
    list.slice(maxValues).forEach((item)=> {
      ++otherCount;
      otherTotal += item.value;
    });
    if (otherTotal > 0) {
      shortList.push({key: `${otherCount} other values`, value: otherTotal});
    }

    return shortList;
  }

  render() {
    let {common, config, data} = this.props;
    let tag = config.dataset.tag;
    let dataset = {...data.datasets[tag]};
    let attributes = [];
    let totalCount = 0, filteredCount=0;
    let filteredStatus = [], filteredType = [];
    let monthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let statusPie = null, typePie = null;
    let status_text = "Dataload initializing...";
    let attValuesLists = {};
    // Run datasets through any filters that are defined.
    if ((dataset.status == 'add' || dataset.status == 'finish')) {
      if (dataset.status == 'add')
        status_text = "Data loading ...";
      else
        status_text = "All data loaded";
      console.log("Filtering from item count " + data.datasets[tag].items.length);
      dataset = this.filterDataset(data.datasets[tag], this.state.filters, true);
      filteredCount = dataset.items.length;
      totalCount = data.datasets[tag].items.length;
      filteredStatus = this.groupByField(dataset.items,'record_status',6);
      filteredType = this.groupByField(dataset.items,'record_type',6);
      console.log("DS: " + JSON.stringify(dataset.definition.query));
      monthlyData = this.groupByMonth(dataset.items, 'record_status_date',
            dataset.definition.query.use_attributes);
      console.log("DS-att: " + JSON.stringify(dataset.definition.attributes));
      attributes = dataset.definition.attributes;
      for (let attKey in this.state.attVisible) {
        attValuesLists[attKey] = this.generateAttValuesList(attKey, dataset.items, dataset.definition.max_attribute_values_to_show);
      }
    }


//    console.log("Filtered Status : " + JSON.stringify(filteredStatus));
//    console.log("Filtered Type: " + JSON.stringify(filteredType));
    let dataset_visit_link = (config.dataset_url == null)?"":
                             (<span style={{float:"right", marginTop:"25px"}}>
                              <a href={config.dataset_url}>Visit this dataset</a></span>);

    return (
      <div className={"container"}>
        <div className="row dash-header">
          <div className="col-md-8">
            <h1>{config.title}</h1>
          </div>
          <div className="col-md-4">
            {dataset_visit_link}
          </div>
        </div>
        <div className="row dash-description">
          <div className="col-md-12 col-sm-12 col-xs-12">
            <p style={{marginTop:"10px", marginLeft:"25px", marginRight:"25px"}}>{config.description}</p>
          </div>
        </div>
        <div className="container dash-main" style={{marginLeft:"10px",marginRight:"10px"}}>
          <div className = "row dash-explore-header">
            <div className="col-md-12" style={{marginBottom:"20px"}}>
              <h2>{config.explore_title}</h2>
            </div>
            <div className="col-md-12" style={{height:"40px"}} >
              <div style={{float:"right"}}>
                <p style={{lineHeight:"40px"}}>
                   <b>Total:</b> {totalCount} &nbsp;&nbsp;
                   <b>Filtered:</b> {filteredCount}
                   &nbsp;&nbsp;&nbsp;&nbsp;
                   ({status_text})
                </p>
              </div>
              <div style={{float:"left"}}>
                <ToggleButtonSet title="" options={this.groupButtonOptions('record_type_group')}/>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <ToggleButtonSet title="" options={this.typeButtonOptions('record_type_type')}/>
              </div>
            </div>
          </div>

          <div className = "dash-explore-body row" style={{marginTop:"10px"}}>
            <div className="dash-explore-keyinfo col-md-6 col-xs-12"
                 style={{borderStyle:"solid", borderWidth:"1px", borderColor:"lightgrey"}}>
              <div style={{textAlign:"center"}}>
                <h3>Key Information in the Dataset</h3>
                <div className="container-fluid dash-explore-keyinfo-list"
                     style={{marginTop: "15px"}}>

                {attributes.map ( (att) => {
                  let moreSpan = null;
                  let visiblePanel = null;
                  if (att.expandable) {
                    const isVisible = (att.name in this.state.attVisible && this.state.attVisible[att.name]);
                    if (isVisible) {
                      moreSpan = (
                        <span style={{float:"right"}}>
                          <a id={"att-"+att.name} onClick={this.unShowValues} className="btn"><i className="fa fa-lg fa-angle-double-up"></i></a>
                        </span>
                      );
                    }
                    else {
                      moreSpan = (
                        <span style={{float:"right"}}>
                          <a id={"att-"+att.name} onClick={this.showValues} className="btn"><i className="fa fa-lg fa-angle-double-down"></i></a>
                        </span>
                      );
                    }
                    if (att.name in this.state.attVisible && this.state.attVisible[att.name]) {
                      let icnt = 0;
                      if (attValuesLists[att.name] != undefined && attValuesLists[att.name].length > 0) {
                        visiblePanel = (
                          <div className="container-fluid" style={{textAlign:"left", marginBottom:"10px"}}>
                            <hr/>
                              <div key={att.name+"-hdr"} className="row" style={{marginBottom:"5px"}}>
                                <div className="col-md-1"></div>
                                <div className="col-md-6">
                                  <u><b>Name</b></u>
                                </div>
                                <div className="col-md-5">
                                  <u><b># of Records</b></u>
                                </div>
                              </div>

                              {attValuesLists[att.name].map( (item) => {
                                return (
                                  <div key={att.name+"-"+icnt++} className="row">
                                    <div className="col-md-1"></div>
                                    <div className="col-md-6">
                                      {item.key}
                                    </div>
                                    <div className="col-md-5">
                                      {item.value}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        );
                      }
                      else {
                        visiblePanel = <p>No values found.</p>
                      }
                    }
                  }
                  return (
                    <div key={"att-key-" + att.name} className="row"
                      style={{paddingTop:"5px", marginTop:"5px", borderStyle:"solid",
                              borderWidth:"1px", borderColor:"lightblue",
                              borderRadius: "15px"}}>
                      <div style={{textAlign:"left", fontSize:"110%"}} className="col-md-4">
                        <strong>{att.display}</strong>
                      </div>
                      <div style={{textAlign:"left"}} className="col-md-8">
                        <p>{att.description}</p>
                        <p>
                          <b>Field name:</b> &nbsp; {att.name}
                          {moreSpan}
                        </p>

                      </div>
                      <div className="col-md-12">
                       {visiblePanel}
                      </div>
                    </div>
                  )
                })}


                </div>
              </div>
            </div>
            <div className="dash-explore-quickview col-md-6 col-xs-12"
              style={{borderStyle:"solid",
                      borderWidth:"1px", borderColor:"lightgrey"
                    }}>
              <div style={{textAlign:"center"}}>
                <h3>Quick View</h3>
              </div>
              <div className="row">
              <div className="col-md-12 col-sm-12">
                <BarChart data={monthlyData} title="Past Year Activity By Month"/>
              </div>
              <div className="col-md-12 col-sm-12">
                <PieChart data={filteredStatus} title="Top Status Values"/>
              </div>
              <div className="col-md-12 col-sm-12">
                <PieChart data={filteredType} title="Top Type Values"/>
              </div>
              </div>

              <br/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  common: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  const { common, data } = state
  return {
    common,
    data
  }
}

export default connect(mapStateToProps)(Dashboard)
