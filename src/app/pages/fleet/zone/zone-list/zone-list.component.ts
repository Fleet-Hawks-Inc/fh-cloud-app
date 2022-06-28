import { Component, OnInit } from '@angular/core';
import Constants from 'src/app/pages/fleet/constants';
import {ApiService} from 'src/app/services'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.css']
})
export class ZoneListComponent implements OnInit {

  constructor(private apiService:ApiService, private toastr: ToastrService) { }
  lastEvaluatedKey=''
  zones=[]
  dataMessage='';
  loaded=false;
  selectedColumns:any[]
  dataColumns:any[]

  ngOnInit(): void {
    this.initData();
    this.dataColumns=[
      {width:'50%', field:'zName',header:'Zone Name',type:'text'},
      {width:'50%',field:'zDesc',header:'Zone Description',type:'text'},
    ]
    this.selectedColumns=this.dataColumns;
  }
  async initData(refresh?:boolean){
    this.loaded=false

    this.loaded=false
    if(refresh===true){
      this.lastEvaluatedKey='';
      this.zones=[];
    }
  const result=await this.apiService.getData("zone?lastKey="+this.lastEvaluatedKey).toPromise();
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
this.zones=this.zones.concat(result.data)

  }

  delete(zoneID:any){
    if(confirm("Are you sure you want Delete?")===true){
      this.apiService.deleteData(`zone/${zoneID}`).subscribe(()=>{
        this.zones=[];
        this.lastEvaluatedKey="";
        this.toastr.success("Zone is Deleted Successfully!");
        this.initData();
      })
    }
  }

  onScroll(event:any){
    if(this.loaded){
      this.initData();
    }
  }
  refreshData(){
    this.zones=[]
    this.dataMessage=Constants.FETCHING_DATA;
    this.lastEvaluatedKey=''
    this.initData();

  }

}
