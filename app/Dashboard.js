import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { store } from 'redux';
import {fetchDataset} from './state/actions/DataActions';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {test: 'foo'}; // DELETE THIS IF WE HAVE NO LOCAL STATE
  }

  componentWillMount() {
    this.props.datasets.map( (dataset) => {
      console.log("I have a dataset with tag " + dataset.tag);
      fetchDataset(dataset, this.props.dispatch);
    });

  }

  render() {
      return (
        <div className={'container'}>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <h1>City of Asheville Permitting Dashboard</h1>
              <p>This is it.</p>
            </div>
          </div>
        </div>
      );
    }
}

Dashboard.propTypes = {
  common: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired
}

function mapStateToProps(state) {
  const { common } = state
  return {
    common
  }
}

export default connect(mapStateToProps)(Dashboard)
