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
      labels: ["Jan","Feb","Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
          {
            backgroundColor: [
                "#5DA5DA",
                "#5DA5DA",
                "#5DA5DA",
                "#5DA5DA",
                "#5DA5DA",
                "#5DA5DA",
                "#5DA5DA",
                "#5DA5DA",
                "#5DA5DA",
                "#5DA5DA",
                "#5DA5DA",
                "#5DA5DA"
            ],
            borderColor: [
              "#777777",
              "#777777",
              "#777777",
              "#777777",
              "#777777",
              "#777777",
              "#777777",
              "#777777",
              "#777777",
              "#777777",
              "#777777",
              "#777777"
            ],
            borderWidth: 1,
            data: [300, 50, 100, 100, 200, 300, 240, 122, 881, 401, 365, 22]
          }]
    };
    this.chartOptions = {
      responsive: true,
      maintainAspectRation: false,
      legend: {
        display: false,
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

      // let labels = [];
      // let ds = {
      //   data: [],
      //   backgroundColor: [],
      //   hoverBackgroundColor: []
      // };
      // data.forEach( (item) => {
      //   labels.push(item.key);
      //   ds.data.push(item.value + 0);
      //   ds.backgroundColor.push(colors[colorIndex]);
      //   ds.hoverBackgroundColor.push(colors[colorIndex]);
      //   ++colorIndex;
      //   if (colorIndex >= colors.length) colorIndex = 0;
      // });
      //
      // this.chartData = {
      //   labels: labels,
      //   datasets: [ds],
      // };
      this.chartData.datasets[0].data = data;
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
    title: React.PropTypes.string.isRequired
};

export default BarChart;
