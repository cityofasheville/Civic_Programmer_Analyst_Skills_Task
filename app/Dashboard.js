import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { store } from 'redux';

import datasets from './datasets';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {test: 'foo'};
  }

  componentWillMount() {
    // Fetch the datasets here.
    console.log("The datasets are: " + JSON.stringify(datasets));
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
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { common } = state
  return {
    common
  }
}

export default connect(mapStateToProps)(Dashboard)
