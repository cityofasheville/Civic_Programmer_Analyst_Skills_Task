import React, { Component, PropTypes } from 'react';

class ToggleButtonSet extends Component {


  createButton (item, index) {
    var callback;
    if (item.action != undefined) {
      callback = item.action;
    }
    else {
      callback = function noop(){};
    }

    var className = "btn btn-default"
    if (item.active === undefined) {
      className += " disabled";
    } else if (item.active) {
      className += " btn-primary active";
    }
    return (<button key={item.name} className={className} onClick={callback}>{item.name}</button>);
  }

  render() {
    let buttons = this.props.options.map(this.createButton, this);
    const title = ((this.props.title && this.props.title.length > 0)?
                   <div className="small"><strong>{this.props.title}:</strong></div>:
                   "");
    return (
        <div className="btn-group" role="group" aria-label={this.props.title}>
          {buttons}
        </div>
    );
  }
}

ToggleButtonSet.defaultProps = {
  columns: 4,
  title: "ToggleButtonSet"
}

export default ToggleButtonSet;
