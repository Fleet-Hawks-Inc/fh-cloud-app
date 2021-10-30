// import { Component, OnInit } from '@angular/core';
// import { result } from 'lodash';
// import { ApiService } from 'src/app/services';
// import Constants from 'src/app/pages/fleet/constants';
// import { ToastrService } from "ngx-toastr";
// import * as moment from 'moment'
// import { count } from 'console';
// @Component({
//   selector: 'app-contact-renewals',
//   templateUrl: './contact-renewals.component.html',
//   styleUrls: ['./contact-renewals.component.css']
// })
// export class ContactRenewalsComponent implements OnInit {
//   allData = [];
//   empData = [];
//   count = [];
//   tasks = [];
//   lastEvaluatedKey = "";
//   contactID = "";
//   searchServiceTask = null;
//   filterStatus = null;
//   loaded = false
//   status = null;
//   dataMessage: string = Constants.FETCHING_DATA

//   constructor(private apiService: ApiService, private toastr: ToastrService) { }

//   ngOnInit() {

//     this.findallData();
//     // this.fetchdata();
//     this.fetchVehiclesdata();

//     // this.fetchdataa();
//   }




//   findallData() {
//     this.apiService.getData("contacts/employee/records").subscribe((result: any) => {
//       this.empData = result.Items;
//       console.log('empData', result)
//     });
//   }
  // fetchdata() {
  //   this.apiService.getData("get/employee/count").subscribe((result: any) => {
  //     this.count = result.Items;
  //     console.log("count", result)
  //   })
  // }
  // fetchdataa() {
  //   this.apiService.getData("tasks/get/list").subscribe((result: any) => {
  //     this.tasks = result.Items;
  //     console.log("tasks", result)
  //   })
  // }
  // fetchVehiclesdata() {
  //   if (this.lastEvaluatedKey !== 'end') {
  //     this.apiService.getData(`reminders/fetch/report/list?reminderIdentification=${this.contactID}&serviceTask=${this.searchServiceTask}&status=${this.filterStatus}&type=service&lastKey=${this.lastEvaluatedKey}`).subscribe((result: any) => {

  //       console.log('this.data', result)
  //       this.allData = result.Items;
  //       this.dataMessage = Constants.FETCHING_DATA
  //       if (result.Items.length === 0) {

  //         this.dataMessage = Constants.NO_RECORDS_FOUND
  //       }
  //       if (result.Items.length > 0) {

  //         if (result.LastEvaluatedKey !== undefined) {
  //           this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].reminderSK);
  //         }
  //         else {
  //           this.lastEvaluatedKey = 'end'
  //         }
  //         this.allData = this.allData.concat(result.Items)

  //         this.loaded = true;
  //       }


  //     });
  //   }
  // }

//   fetchVehiclesdata() {
//     if (this.lastEvaluatedKey !== 'end') {
//       this.apiService.getData(`reminders/fetch/records?reminderIdentification=${this.contactID}&serviceTask=${this.searchServiceTask}&status=${this.filterStatus}&type=service&lastKey=${this.lastEvaluatedKey}`).subscribe((result: any) => {

//         console.log('this.data', result)
//         this.allData = result.Items;
//         this.dataMessage = Constants.FETCHING_DATA
//         if (result.Items.length === 0) {

//           this.dataMessage = Constants.NO_RECORDS_FOUND
//         }
//         if (result.Items.length > 0) {

//           if (result.LastEvaluatedKey !== undefined) {
//             this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].reminderSK);
//           }
//           else {
//             this.lastEvaluatedKey = 'end'
//           }
//           this.allData = this.allData.concat(result.Items)

//           this.loaded = true;
//         }


//       });
//     }
//   }



// }