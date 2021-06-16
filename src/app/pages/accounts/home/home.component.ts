import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
// graph
chartOptions = {};
chartLabels = [];
chartType = '';
chartLegend;
chartData = [];

chartOptions1 = {};
chartLabels1 = [];
chartType1 = '';
chartLegend1;
chartData1 = [];

chartOptions2 = {};
chartLabels2 = [];
chartType2 = '';
chartLegend2;
chartData2 = [];
  constructor() { }

  ngOnInit() {
    this.initCashGraph();
    this.initIncomeExpenseGraph();
    this.initTopExpensesGraph();
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
    this.chartLabels = ['April','May', 'June', 'July', 'August', 'September', 'October', 'November', 'December','January', 'February', 'March' ],
    this.chartType = 'line';
    this.chartLegend = true;
    this.chartData = [
      {
        label: 'OPENING',
        fill: false,
        backgroundColor: '#9c9ea1',
        borderColor: '#9c9ea1',
        borderWidth: 1,
        data: [
          15,85,45,15,16,18,84,58,64,15,74,15,1,69,25,45
        ],
      },
      {
        label: 'INCOMING',
        fill: false,
        backgroundColor: '#649e73',
        borderColor: '#649e73',
        borderWidth: 1,
        data: [
          12,56,23,56,78,34,89,45,89,45,90,23,62,94,56,34
        ],
     },
     {
       label: 'OUTGOING',
       fill: false,
       backgroundColor: '#d99a89',
       borderColor: '#d99a89',
       borderWidth: 1,
       data: [
        58,64,15,74,15,85,45,15,16,18,84,15,5,2,56,89,45
       ],
    },
    {
      label: 'ENDING',
      fill: false,
      backgroundColor: '#4689e0',
      borderColor: '#4689e0',
      borderWidth: 1,
      data: [
        56,18,25,95,74,56,23,78,45,89,49,23,94,25,68,34
      ],
   }
    ];
  }
 initIncomeExpenseGraph() {
  this.chartOptions1 = {
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
      xAxes: [{
          barPercentage: 0.4
      }]
    }
  //   scales: {
  //     yAxes: [{
  //        display: true,
  //        scaleLabel: {
  //           display: true,
  //        },
  //        ticks: {
  //           min: 0,
  //           stepSize: 20,
  //           suggestedMin: 0,
  //           callback: (value, index, values) => {
  //              return value;
  //           }
  //        }
  //     }]
  //  }
  };
  this.chartLabels1 = ['April','May', 'June', 'July', 'August', 'September', 'October', 'November', 'December','January', 'February', 'March' ],
  this.chartType1 = 'bar';
  this.chartLegend1 = true;
  this.chartData1 = [
    {
      label: 'Income',
      fill: false,
      backgroundColor: '#9c9ea1',
      borderColor: '#9c9ea1',
      borderWidth: 1,
      data: [
        15,85,45,64,15,74,15,1,69,25,45,15,16,18,84,58,
      ],
    },
    {
      label: 'Expense',
      fill: false,
      backgroundColor: '#649e73',
      borderColor: '#649e73',
      borderWidth: 1,
      data: [
        12,56,23,56,78,34,89,45,89,45,90,23,62,94,56,34
      ],
   }
  ];
 }

 initTopExpensesGraph() {
  this.chartOptions2 = {
    responsive: true,
     maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
    },
    hover: {
        mode: 'nearest',
        intersect: true
    },
    legend: {
        position: 'right',
        labels: {
          boxWidth: 10
        }
    },
  };
  this.chartLabels2 = ['Cost of Goods Sold' , 'Advertising & Marketing', 'Salaries and Employee Wages'],
  this.chartType2 = 'pie';
  this.chartLegend2 = true;
  this.chartData2 = [{backgroundColor: ['#82c493', '#42a65b', '#568562'],
    data: [
       53, 67, 45
    ],
 }
 ];
 }
}
