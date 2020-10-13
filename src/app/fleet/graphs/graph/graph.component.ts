import { Component, OnInit } from '@angular/core';
import {Graph} from '../models/graph';
import {GraphData} from '../models/graph-data';
import {Color, Label} from 'ng2-charts';
import {ChartDataSets} from 'chart.js';
import {from, of} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  graphData$;
  title : 'Graph';
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  linechartData = [];
  //Lables = ['11PM', '5AM', '6AM', '7AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM' , '12PM'];
  //Labels = [];

  lineChartData: ChartDataSets[] = [
    { data: this.linechartData, label: 'Temp' },
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.24)',
    },
  ];


  constructor(private router: Router) {}

  loadData() {
    this.graphData$ = from(GraphData.products);
  }



  ngOnInit() {
    this.loadData();
    this.drawMap();
  }

  redrawGraph() {
    this.drawMap();
    //this.router.navigateByUrl('/healthcheck', { skipLocationChange: true });
    //this.router.navigate(['fleet/graphs/view-graph'] , { skipLocationChange: true });


  }

  drawMap() {
    this.graphData$
    // .pipe(
    //   map((v: any) => {
    //     {
    //       'time' : v.time,
    //       'temp' : v.temp
    //     }
    //
    // }))
    .subscribe(v => {
      console.log(v);
        this.lineChartLabels.push(v.time);
        this.linechartData.push(v.temp);
      });
  }

}
