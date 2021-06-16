import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cash-flow-statement',
  templateUrl: './cash-flow-statement.component.html',
  styleUrls: ['./cash-flow-statement.component.css']
})
export class CashFlowStatementComponent implements OnInit {
// graph
chartOptions = {};
chartLabels = [];
chartType = '';
chartLegend;
chartData = [];
  constructor() { }

  ngOnInit() {
    this.initCashGraph();
  }
  initCashGraph() {
    this.chartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      // maintainAspectRatio: false,
      tooltips: {
          mode: 'index',
          intersect: false,
      },
      hover: {
          mode: 'nearest',
          intersect: true
      },
      legend: {
          position: 'top',
          labels: {
            boxWidth: 10
          }
      },
      scales: {
        yAxes: [{
           display: true,
           scaleLabel: {
              display: true,
           },
           ticks: {
              min: 0,
              stepSize: 20,
              suggestedMin: 0,
              callback: (value, index, values) => {
                 return value;
              }
           }
        }]
     }
    };
    this.chartLabels = ['Sep 01', 'Sep 02', 'Sep 03', 'Sep 04', 'Sep 05', 'Sep 06', 'Sep 07', 'Sep 08', 'Sep 09', 'Sep 10', 'Sep 11', 'Sep 12', 'Sep 13', 'Sep 14', 'Sep 15', 'Sep 16', 'Sep 17', 'Sep 18', 'Sep 19', 'Sep 20', 'Sep 21', 'Sep 22', 'Sep 23', 'Sep 24', 'Sep 25', 'Sep 26', 'Sep 27', 'Sep 28', 'Sep 29', 'Sep 30'],
    this.chartType = 'line';
    this.chartLegend = true;
    this.chartData = [
      {
        label: 'Balance',
        fill: false,
        backgroundColor: '#9c9ea1',
        borderColor: '#9c9ea1',
        borderWidth: 1,
        data: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
      },
      {
        label: 'Cash Flow In',
        fill: false,
        backgroundColor: '#649e73',
        borderColor: '#649e73',
        borderWidth: 1,
        data: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
     },
     {
       label: 'Cash Flow Out',
       fill: false,
       backgroundColor: '#d99a89',
       borderColor: '#d99a89',
       borderWidth: 1,
       data: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
       ],
    }
    ];
  }
}
