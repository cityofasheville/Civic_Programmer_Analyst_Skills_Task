import React, { Component, PropTypes } from 'react';
import {autobind} from 'core-decorators'
import Chart from "chart.js";

class BarChart extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.savedDiv = null;
    this.savedChart = null;
    this.chartData = {
      labels: [],
      datasets: [
        {
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
          data: []
        }]
    };
    this.chartOptions = {
      responsive: true,
      animation: false,
      maintainAspectRation: false,
      legend: {
        display: false,
        position: 'bottom',
        fullWidth: false
      },
      title: {
        display: true,
        fontSize: 18,
        text: ""
      }
    };
  }

  componentDidMount() {
    let el = this.savedDiv;
    if (el != null) {
      let myChart = new Chart(el, {
        type: 'bar',
        data: this.chartData,
        options: this.chartOptions
      });
      this.savedChart = myChart;
    }
  }

  @autobind
  saveDiv(div) {
    if (div == null) {
      //console.log("Called saveDiv with null");
    }
    else {
      this.savedDiv = div;
    }
  }

  componentDidUpdate() {
    let el = this.savedDiv;
    if (this.savedChart != null) {
      this.savedChart.destroy();
      this.savedChart = null;
    }

    if (el != null) {
      let myChart = new Chart(el, {
        type: 'bar',
        data: this.chartData,
        options: this.chartOptions
      });
      this.savedChart = myChart;
    }
  }

  componentWillUnmount () {
      $(".bar-tooltip").remove();
  }

  render() {
    const {data, labels} = this.props;
    let colorIndex = 0;
    const colors = [
      "#5DA5DA", // (blue)
      "#FAA43A", // (orange)
      "#60BD68", // (green)
      "#F17CB0", // (pink)
      "#B2912F", // (brown)
      "#B276B2", // (purple)
      "#DECF3F", // (yellow)
      "#F15854", // (red)
      "#4D4D4D"  // (gray)
    ];
    this.chartData.labels = labels;
    this.chartData.datasets[0].data = data;
    this.chartData.datasets[0].backgroundColor = new Array(data.length).fill("#5DA5DA");
    this.chartData.datasets[0].borderColor = new Array(data.length).fill("#777777");
    this.chartOptions.title.text = this.props.title;
    return (
      <div>
        <canvas  ref={this.saveDiv}></canvas>
      </div>
    )
  }
}

BarChart.PropTypes= {
  data: React.PropTypes.array.isRequired,
  labels: React.PropTypes.array.isRequired,
  title: React.PropTypes.string.isRequired
};

export default BarChart;
