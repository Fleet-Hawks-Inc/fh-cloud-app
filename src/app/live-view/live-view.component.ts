import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MapBoxService } from "../map-box.service";
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import {Chart} from 'chart.js';
declare var $: any;
@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('400ms', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('400ms', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    // trigger('slideUpdown', [
    //   transition(':enter', [
    //     style({ transform: 'translateY(100%)' }),
    //     animate('400ms', style({ transform: 'translateY(0%)' }))
    //   ]),
    //   transition(':leave', [
    //     animate('400ms', style({ transform: 'translateY(100%)' }))
    //   ])
    // ])
  ]
})
export class LiveViewComponent implements OnInit {
   // Mapbox Integration
   map: mapboxgl.Map;
   style = 'mapbox://styles/kunalfleethawks/ck86yfrzp0g3z1illpdp9hs3g';
   lat = -104.618896;
   lng = 50.445210;
   isControlAdded = false;
   visible = true;
   chart:any = [];
   chart1:any = [];
   chart2:any = [];
   graphType ='line';
  constructor(private mapBoxService: MapBoxService) { }

  ngOnInit() {
    this.charts();
    this.charts1();
    this.charts2();
    this.mapboxInit();
   
  }
  changeBarGraph(){
    this.chart.destroy();
    this.graphType = 'bar';
    this.charts();
  }
  changeLineGraph(){
    this.chart.destroy();
    this.graphType = 'line';
    this.charts();
    }
  charts(){    
    this.chart = new Chart('canvas',{
      type: this.graphType,
      data : {
        labels: ['31 July 12:00', '31 July 18:00','1 Aug 00:00', '1 Aug 06:00', '1 Aug 12:00','1 Aug 18:00','2 Aug 00:00','2 Aug 06:00','2 Aug 12:00','2 Aug 18:00'],
        datasets: [{
          label: 'Set Temperature',
          fill: false,
          backgroundColor: '#9c9ea1',
          borderColor: '#9c9ea1',
          borderWidth: 1,
          
          data: [
          33,35,30,29,28,30,25,24,30,33,35,30,29,28,30,25,24 
          ],
        },
        {
          label: 'Actual Temperature',
          fill: false,
          backgroundColor: '#000',
          borderColor: '#000',
          borderWidth: 1,
         
          data: [
            31,33,29,29,26,29,28,24,33,31,33,29,29,26,29,28,24,33
          ],
        }
      ]
      },
      options:{
         responsive: true,   
         maintainAspectRatio : false,     
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        legend:{
         position:'top',
         labels:{
           boxWidth:10
         }
        },
        scales: {
          yAxes: [{            
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Temperature (F)'
            },
            ticks: {
              min: 0,
              max: 80,
              stepSize: 10,
              suggestedMin: 0,
              suggestedMax: 80,
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                return value + '°F';
              }
          }
            
          }]
        }
      }
    }); 
  }
  changeBarGraph1(){
    this.chart1.destroy();
    this.graphType = 'bar';
    this.charts1();
  }
  changeLineGraph1(){
    this.chart1.destroy();
    this.graphType = 'line';
    this.charts1();
    }
  charts1(){    
    this.chart1 = new Chart('canvas1',{
      type: this.graphType,
      data : {
        labels: ['31 July 12:00', '31 July 18:00','1 Aug 00:00', '1 Aug 06:00', '1 Aug 12:00','1 Aug 18:00','2 Aug 00:00','2 Aug 06:00','2 Aug 12:00','2 Aug 18:00'],
        datasets: [{
          label: 'Set Temperature',
          fill: false,
          backgroundColor: '#9c9ea1',
          borderColor: '#9c9ea1',
          borderWidth: 1,
          data: [
          12,15,17,13,15,12,18,12,18,13,10,14,12 
          ],
        },
        {
          label: 'Actual Temperature',
          fill: false,
          backgroundColor: '#000',
          borderColor: '#000',
          borderWidth: 1,
          data: [
            10,14,12,11,14,11,15,12,16,14,11,13,14
          ],
        }
      ]
      },
      options:{
        responsive: true,
        maintainAspectRatio : false,
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        legend:{
         position:'top',
         labels:{
           boxWidth:10
         }
        },
        scales: {
          yAxes: [{
            // ticks: {beginAtZero:true},
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Temperature (F)'
            },
            ticks: {
              min: 0,
              max: 80,
              stepSize: 10,
              suggestedMin: 0,
              suggestedMax: 80,
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                  return   value + '°F';
              }
          }
            
          }]
        }
      }
    }); 
  }
  changeBarGraph2(){
    this.chart2.destroy();
    this.graphType = 'bar';
    this.charts2();
  }
  changeLineGraph2(){
    this.chart2.destroy();
    this.graphType = 'line';
    this.charts2();
    }
  charts2(){    
    this.chart2 = new Chart('canvas2',{
      type: this.graphType,
      data : {
        labels: ['31 July 12:00', '31 July 18:00','1 Aug 00:00', '1 Aug 06:00', '1 Aug 12:00','1 Aug 18:00','2 Aug 00:00','2 Aug 06:00','2 Aug 12:00','2 Aug 18:00'],
        datasets: [{
          label: 'Set Temperature',
          fill: false,
          backgroundColor: '#9c9ea1',
          borderColor: '#9c9ea1',
          borderWidth: 1,
          data: [
          22,25,23,24,25,22,23,20,24,21,23,25 
          ],
        },
        {
          label: 'Actual Temperature',
          fill: false,
          backgroundColor: '#000',
          borderColor: '#000',
          borderWidth: 1,
          data: [
            23,22,21,26,23,21,27,20,22,23,20,22 
          ],
        }
      ]
      },
      options:{
        responsive: true,
        maintainAspectRatio : false,
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        legend:{
         position:'top',
         labels:{
           boxWidth:10
         }
        },
        scales: {
          yAxes: [{
            // ticks: {beginAtZero:true},
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Temperature (F)'
            },
            ticks: {
              min: 0,
              max: 80,
              stepSize: 10,
              suggestedMin: 0,
              suggestedMax: 80,
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                  return   value + '°F';
              }
          }
            
          }]
        }
      }
    }); 
  }
  showReefer1(){    
     $(document).ready(function(){
      $('#reefer1Div').show();
      $('#reefer2Div').hide();
      $('#reefer3Div').hide();
      $('#dashCamDiv').hide();
    });
  }
  showReefer2(){    
    $(document).ready(function(){
     $('#reefer1Div').hide();
     $('#reefer2Div').show();
     $('#reefer3Div').hide();
     $('#dashCamDiv').hide();
   });
 }
 showReefer3(){    
  $(document).ready(function(){
   $('#reefer1Div').hide();
   $('#reefer2Div').hide();
   $('#reefer3Div').show();
   $('#dashCamDiv').hide();
 });
}
  valuechange() {
    this.visible = !this.visible;
  }
  mapboxInit = () => {

    // Initialize Map
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 3,
      center: [-104.618896, 50.445210],
      accessToken: environment.mapBox.accessToken
    });
}
}
