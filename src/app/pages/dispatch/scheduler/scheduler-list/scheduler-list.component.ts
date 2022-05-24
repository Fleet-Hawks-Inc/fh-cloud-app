import { Component, OnInit } from '@angular/core';
import Constants from 'src/app/pages/fleet/constants';
import { ApiService } from 'src/app/services';

@Component({
  selector: 'app-scheduler-list',
  templateUrl: './scheduler-list.component.html',
  styleUrls: ['./scheduler-list.component.css']
})
export class SchedulerListComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  lastEvaluatedKey='';
  schedules=[];
  dataMessage='';
  ngOnInit(): void {
    this.initData();
  }

  resetData(){

  }
  async initData(refresh?: boolean){
    if(refresh===true){
      this.lastEvaluatedKey='';
      this.schedules=[];
    }
  const result=await this.apiService.getData("orders/schedule?lastKey="+this.lastEvaluatedKey).toPromise();
  if(result.data.length==0){
    this.dataMessage=Constants.NO_RECORDS_FOUND
  }
  if(result.nextKey!==undefined){
    this.lastEvaluatedKey=result.nextKey;
  }
  else{
    this.lastEvaluatedKey=undefined
  }
this.schedules=this.schedules.concat(result.data)
console.log(this.schedules)
  }
}
