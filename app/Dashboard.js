import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { store } from 'redux';
import {fetchDataset} from './state/actions/DataActions';
import ToggleButtonSet from './components/ToggleButtonSet';
import PieChart from "./components/PieChart.js";
import BarChart from "./components/BarChart.js";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    let filters = {
      status: [],
      group: [],
      permit_type: [],
      category: [],
      work_type: [],
      work_subtype: []
    }
    this.state = {
      filters
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

  render() {
    let {common, config, data} = this.props;
    let tag = config.dataset.tag;
    let dataset = {...data.datasets[tag]};
    let totalCount = 0, filteredCount=0;
    let filteredStatus = [], filteredType = [];
    let monthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let statusPie = null, typePie = null;
    let status_text = "Dataload initializing...";
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
      filteredStatus = this.groupByField(dataset.items,'status',6);
      filteredType = this.groupByField(dataset.items,'work_type',6);
      this.counter = 0;
      console.log("DS: " + JSON.stringify(dataset.definition.query));
      monthlyData = this.groupByMonth(dataset.items, 'record_status_date',
            dataset.definition.query.use_attributes);

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
                <ToggleButtonSet title="" options={this.groupButtonOptions('group')}/>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <ToggleButtonSet title="" options={this.typeButtonOptions('permit_type')}/>
              </div>
            </div>
          </div>

          <div className = "dash-explore-body row" style={{marginTop:"10px"}}>
            <div className="dash-explore-keyinfo col-md-6 col-xs-12"
                  style={{borderStyle:"solid",
                          borderWidth:"1px", borderColor:"lightgrey"
                        }}>
              <div style={{textAlign:"center"}}>
                <h3>Key Information in the Dataset</h3>
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
