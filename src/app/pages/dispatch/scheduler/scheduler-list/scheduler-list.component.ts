import { Component, OnInit, Input } from '@angular/core';
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
  loaded=false;
  _selectedColumns:any[];
  dataColumns:any[];

  ngOnInit(): void {
    this.initData();
    this.dataColumns=[
      {width:'10%', field:'orderNumber',header:'Order#',type:'text'},
      {width:'10%',field:'sName',header:'Scheduler Name',type:'text'},
      {width:'10%',field:'sTime',header:'Scheduler Time',type:'text'}
    ]
    this._selectedColumns=this.dataColumns;
  }
  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: any[]) {
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));
  }

  resetData(){

  }
  async initData(refresh?: boolean){
    this.loaded=false
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
  this.loaded=true;
this.schedules=this.schedules.concat(result.data)
console.log(this.schedules)
  }
  delete(){
    
  }
}
