import { Component, OnInit } from '@angular/core';
import { Constants } from '@aws-amplify/core';
import { result } from 'lodash';
import { ApiService } from 'src/app/services';

@Component({
  selector: 'app-sreminders',
  templateUrl: './sreminders.component.html',
  styleUrls: ['./sreminders.component.css']
})

export class SremindersComponent implements OnInit {
  entityID = '';
  allData = [];
  allDatta = [];
  pageLength="10";
  vehicleList = {};
  vehicleTask = {};
  OverdueService = 0;
  due = 0;
  totalRecords="10";
  suggestedVehicles = [];
  searchValues = "";
  carrierID="";
  currentStatus = "null";
  lastEvaluatedKey="";
  carrierEndPoint = this.pageLength;
  vehiclesList = [];
  taskfunction = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    // this.newfunction();
    // this.linkfunction();
    this.tasksfunction();
    this.fetchVehiclesdata();
    this.fetchvehicleSList();


  }
  // initDataTable() {
  //   this.apiService.getData('vehicles/fetch/records?vehicle='+this.carrierID+'&status='+this.currentStatus + '&lastKey=' + this.lastEvaluatedKey)
  //     .subscribe((result: any) => {
  //       if(result.Items.length == 0) {
        
  //       }
  //     }
  //     )}
  fetchVehiclesdata(){
    this.apiService.getData(`reminders/fetch/report/list?name=${this.entityID}&type=service`).subscribe((result:any) =>{
        console.log('this.data',result)
        this.allData = result.Items;
    });
  }
  srchVeh(){
    if (this.entityID !== '' || this.entityID!= null){
 
      this.entityID = this.entityID;
      this.allData =[];
    
      this.fetchVehiclesdata();
    }
    else{
      return false;
    }
  }
  
  newfunction() {
    this.apiService.getData("reminders").subscribe((result: any) => {
      this.allData = result.Items;
      console.log("this.allData", this.allData);
    })
  }
 
  // linkfunction() {
  //   this.apiService.getData("vehicles/get/list").subscribe((result: any) => {
  //     console.log("this.allData", result)
  //     this.vehicleList = result;
  //     if(this.vehicleList == '') {
  //       this.vehicleList = this.srchVeh;
  //     }
  //     this.vehicleList = [];
  //     this.suggestedVehicles = [];
  //     this.fetchVehiclesdata();
  //     // this.initDataTable();
  //   }
  //   )}

  fetchvehicleSList() {
    this.apiService.getData("vehicles/get/list").subscribe((result: any) => {
      this.vehiclesList = result;
      console.log("vehicleList" , result)
    });
  }
    
  tasksfunction() {
    this.apiService.getData("tasks/get/list").subscribe((result: any) => {
      console.log("this.allData", result)
      this.taskfunction = result;


      for (let i = 0; i < this.allData.length; i++) {
        if (this.allData[i].status === 'overdue') {
          this.OverdueService += 1;
        }
        else {
          this.due += 1;
        }

      }
      console.log("OverdueService", this.OverdueService)
    })
  }
  // searchfunction() {
  //   console.log("hello", this.srchVeh)
  //   if (this.searchValues != '') {
  //     this.searchValues = this.searchValues.toLowerCase();
  //     console.log("searchValue", this.searchValues)

  //   }
  // }
}



