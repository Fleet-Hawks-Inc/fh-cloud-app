import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../../services/api.service";
import {  ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";
import {ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-add-scheduler',
  templateUrl: './add-scheduler.component.html',
  styleUrls: ['./add-scheduler.component.css']
})
export class AddSchedulerComponent implements OnInit {

  constructor(     private apiService: ApiService,
    private toastr: ToastrService,  private location: Location,
    private route:ActivatedRoute) { }
  scheduler={
    orderID:null,
    orderNumber:null,
    name:null,
    time:null,
    type:{
      daysNo:'',
      days:[]
    },
    range:{
      dateRange:{
        to:null,
        from:null,
      },
      months:[]
    }
  }
  saveDisabled=false;
  repeatType=null;
  range=null;
  days=["everyday","monday","tuesday","wednesday","thursday","friday","saturday","sunday"]
  months=["selectAll","january","february","march","april","may","june","july","august","september","october","november","december"]
  orders:any;
  schedulerID:any=''
  async ngOnInit( ) {
    this.schedulerID=this.route.snapshot.params["scheduleID"]
    if(this.schedulerID){
      this.fetchScheduleByID();
    }
    await this.fetchOrderList();
  }

  async fetchScheduleByID(){
    const result=await this.apiService.getData('orders/schedule/'+this.schedulerID).toPromise();
    if(result && result.length>0){
      const data=result[0]
      this.scheduler.name= data.sName;
      this.scheduler.time=data.sTime;
      this.scheduler.range=data.sRange;
      this.scheduler.orderID=data.orderID;
      this.scheduler.orderNumber=data.orderNumber;
      this.scheduler.type=data.sType;

      if(this.scheduler.type.days===undefined){
        this.repeatType="selectDaysNo";
      }
      else{
        this.repeatType="days";
      }
      if(this.scheduler.range.dateRange==undefined){
        this.range="month";
      }
      else{
        this.range="date";
      }

    }

  }
  async fetchOrderList(){
    const orders=await this.apiService.getData('orders/get/list').toPromise();
    this.orders=orders
  }
  onCheckboxChange(data,isChecked){
    if(isChecked){
      this.scheduler.type.days.push(data)
    }
    else{
      const index=this.scheduler.type.days.findIndex(x=>x==data);
      this.scheduler.type.days.splice(index,1)
    }
  }

  onRangeCheckboxChange(value,isChecked){
    if(isChecked){
      this.scheduler.range.months.push(value)
    }
    else{
      const index=this.scheduler.range.months.findIndex(x=>x==value);
      this.scheduler.type.days.splice(index,1)
    }
  }

  async updateScheduler(){
    this.saveDisabled=true;
    if(this.scheduler.orderID) this.scheduler.orderNumber=this.orders[this.scheduler.orderID]
    console.log(this.scheduler)
    if(this.scheduler.orderID==null || this.scheduler.orderNumber==null)
    {
      this.toastr.error("Reference Order is required");
      this.saveDisabled=false;
      return 
    }
    if(this.scheduler.name==null){
      this.toastr.error("Scheduler Name is required");
      this.saveDisabled=false;
      return 
    }
    if(this.scheduler.time==null){
      this.toastr.error("Scheduler Time is required");
      this.saveDisabled=false;
      return;
    }
    if(this.repeatType==null){
      this.toastr.error("Repeat Type is required");
      this.saveDisabled=false;
      return;
    }
    if(this.range==null){
      this.toastr.error("Range is required");
      this.saveDisabled=false;
      return;
    }
    if(this.repeatType=="selectDaysNo"){
      delete this.scheduler.type.days
    }
    else{
      delete this.scheduler.type.daysNo
    }

    if(this.range=="date"){
      delete this.scheduler.range.months;
    }
    else{
      delete this.scheduler.range.dateRange
    }
    const scheduleData={
      orderID:this.scheduler.orderID,
      orderNumber:this.scheduler.orderNumber,
      sName:this.scheduler.name,
      sType:this.scheduler.type,
      sTime:this.scheduler.time,
      sRange:this.scheduler.range,
      orderSK:`ORDSCH#`+this.schedulerID,
      id:this.schedulerID
  }
    this.apiService.putData('orders/schedule',scheduleData).subscribe({
      complete:()=>{},
      error:(err)=>{},
      next:(res)=>{
        this.toastr.success("Schedule added successfully");
        this.location.back();
      }
    })
  }

  async saveScheduler(){
    this.saveDisabled=true;
    if(this.scheduler.orderID) this.scheduler.orderNumber=this.orders[this.scheduler.orderID]
    console.log(this.scheduler)
    if(this.scheduler.orderID==null || this.scheduler.orderNumber==null)
    {
      this.toastr.error("Reference Order is required");
      this.saveDisabled=false;
      return 
    }
    if(this.scheduler.name==null){
      this.toastr.error("Scheduler Name is required");
      this.saveDisabled=false;
      return 
    }
    if(this.scheduler.time==null){
      this.toastr.error("Scheduler Time is required");
      this.saveDisabled=false;
      return;
    }
    if(this.repeatType==null){
      this.toastr.error("Repeat Type is required");
      this.saveDisabled=false;
      return;
    }
    if(this.range==null){
      this.toastr.error("Range is required");
      this.saveDisabled=false;
      return;
    }
    if(this.repeatType=="selectDaysNo"){
      delete this.scheduler.type.days
    }
    else{
      delete this.scheduler.type.daysNo
    }

    if(this.range=="date"){
      delete this.scheduler.range.months;
    }
    else{
      delete this.scheduler.range.dateRange
    }
    const scheduleData={
      orderID:this.scheduler.orderID,
      orderNumber:this.scheduler.orderNumber,
      sName:this.scheduler.name,
      sType:this.scheduler.type,
      sTime:this.scheduler.time,
      sRange:this.scheduler.range
  }
    this.apiService.postData('orders/schedule',scheduleData).subscribe({
      complete:()=>{},
      error:(err)=>{},
      next:(res)=>{
        this.toastr.success("Schedule added successfully");
        this.location.back();
      }
    })
    
  }
  back(){
    this.location.back();
  }

}
