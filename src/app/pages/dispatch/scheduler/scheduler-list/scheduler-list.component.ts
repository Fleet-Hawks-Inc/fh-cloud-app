import { Component, OnInit, Input } from '@angular/core';
import Constants from 'src/app/pages/fleet/constants';
import { ApiService } from 'src/app/services';
import {ToastrService} from 'ngx-toastr'

@Component({
  selector: 'app-scheduler-list',
  templateUrl: './scheduler-list.component.html',
  styleUrls: ['./scheduler-list.component.css']
})
export class SchedulerListComponent implements OnInit {

  constructor(private apiService: ApiService,private toastrService: ToastrService) { }

  lastEvaluatedKey='';
  schedules=[];
  dataMessage='';
  loaded=false;
  _selectedColumns:any[];
  dataColumns:any[];
  ngOnInit(): void {
    this.initData();
    this.dataColumns = [
      { width: "20%", field: "orderNumber", header: "Order#", type: "text" },
      {
        width: "20%",
        field: "customerName",
        header: "Customer Name",
        type: "text",
      },
      { width: "20%", field: "sName", header: "Schedule Name", type: "text" },
      { width: "20%", field: "sTime", header: "Scheduled Time", type: "text" },
    ];
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

  if(this.lastEvaluatedKey==undefined){
    this.lastEvaluatedKey='end'
  }
  this.loaded=true;
this.schedules=this.schedules.concat(result.data)
  }

  delete(scheduleID:any,mongoID){
    if(confirm("Are you sure you want deactivate?")===true){
      this.apiService.deleteData(`orders/schedule/deactivate/${scheduleID}/${mongoID}`).subscribe(()=>{
        this.schedules=[];
        this.lastEvaluatedKey="";
        this.toastrService.success("Schedule is Deactivated Successfully!");
        this.initData();
      })
    }
  }

  activate(scheduleID:any,data:any){
    if(confirm("Are you sure you want activate?")===true){
      const result=this.apiService.postData(`orders/schedule/activate/${scheduleID}`,data).subscribe(()=>{   
      this.toastrService.success("Schedule is Activated Successfully!");
      this.schedules=[];
      this.lastEvaluatedKey="";
      this.initData();
      });

    }
  }

  refreshData(){
    this.schedules=[]
    this.dataMessage=Constants.FETCHING_DATA;
    this.lastEvaluatedKey=''
    this.initData();

  }
  onScroll(event:any){
    if(this.loaded){
      this.initData();
    }

  }
}
