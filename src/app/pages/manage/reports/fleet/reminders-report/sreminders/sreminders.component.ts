import { Component, OnInit } from '@angular/core';
import { result } from 'lodash';
import { ApiService } from 'src/app/services';

@Component({
  selector: 'app-sreminders',
  templateUrl: './sreminders.component.html',
  styleUrls: ['./sreminders.component.css']
})

export class SremindersComponent implements OnInit {
  allData = [];
  allDatta = [];
  vehicleList= {};
  vehicleTask = {};
  OverdueService= 0;
  due=0;
  constructor(private  apiService: ApiService) { }

  ngOnInit() {
    this.newfunction();
    this.linkfunction();
    this.tasksfunction();
    this.resetfunction();
  
  }
  
newfunction(){
this.apiService.getData("reminders").subscribe((result:any)=>{
  this.allData=result.Items;
  console.log("this.allData",this.allData);
})
}
linkfunction(){
  this.apiService.getData("vehicles/get/list").subscribe((result:any)=>{
    console.log("this.allData" , result)
    this.vehicleList=result;
  })
}
tasksfunction(){
  this.apiService.getData("tasks/get/list").subscribe((result:any)=>{
    console.log("this.allData" , result)
    this.tasksfunction= result;
    
    
    for(let i=0; i< this.allData.length; i++) {
    if(this.allData[i].status === 'overdue'){
       this.OverdueService += 1;
    }
    else{
      this.due += 1;
    }
    
    }
    console.log("OverdueService" , this.OverdueService)
  })
}
  resetfunction(){
    this.apiService.getData("listing/listing.component.ts/resetFilter").subscribe((result:any)=>{
      console.log("this.allData" , result)
    })
  }
}

 

