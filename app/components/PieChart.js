import React, { Component, PropTypes } from 'react';
import {autobind} from 'core-decorators'
//import d3 from 'd3';
import Chart from "chart.js";
//var d3BarChart = require('./D3BarChart');

class PieChart extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.savedDiv = null;
    this.savedChart = null;
    this.chartData = {
      labels: ["Red","Blue","Yellow"],
      datasets: [
          {
              data: [300, 50, 100],
              backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56"
              ],
              hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56"
              ]
          }]
    };
    this.chartOptions = {
      responsive: true,
      maintainAspectRation: false,
      legend: {
        display: true,
        position: 'bottom',
        fullWidth: false
      },
      title: {
        display: true,
        text: "Hello there"
      }
    };
  }

  componentDidMount() {
    let el = this.savedDiv;
    if (el != null) {
      let myChart = new Chart(el, {
        type: 'pie',
        title: "Hi",
        data: this.chartData,
        options: this.chartOptions
      });
      this.savedChart = myChart;
    }
  }

  @autobind
  saveDiv(div) {
    if (div == null) {
      console.log("Called saveDiv with null");
    }
    else {
      console.log("Called saveDiv without null")
      this.savedDiv = div;
    }
  }

    componentDidUpdate() {
      console.log("I'm in componentDidUpdate");
      let el = this.savedDiv;
      if (this.savedChart != null) {
        console.log("Now we destroy!");
        this.savedChart.destroy();
        this.savedChart = null;
      }
      console.log("On we go");
      if (el != null) {
        let myChart = new Chart(el, {
          type: 'pie',
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
      const {data} = this.props;
      console.log("Here's the data: " + JSON.stringify(data));
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

      let labels = [];
      let ds = {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: []
      };
      data.forEach( (item) => {
        labels.push(item.key);
        ds.data.push(item.value + 0);
        ds.backgroundColor.push(colors[colorIndex]);
        ds.hoverBackgroundColor.push(colors[colorIndex]);
        ++colorIndex;
        if (colorIndex >= colors.length) colorIndex = 0;
      });

      this.chartData = {
        labels: labels,
        datasets: [ds],
      };
      this.chartOptions.title.text = this.props.title;
      return (
          <div>
              <canvas  ref={this.saveDiv}></canvas>
          </div>
      )
    }
}

PieChart.PropTypes= {
    data: React.PropTypes.array.isRequired,
    title: React.PropTypes.string.isRequired
};

export default PieChart;
