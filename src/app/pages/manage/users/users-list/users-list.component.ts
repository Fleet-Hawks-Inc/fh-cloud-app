import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit  {
  users: any = [];
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';
  userName = '';
  currentStatus = '';
  departmentName = ''
  constructor(private apiService: ApiService,private toastr: ToastrService) { }

  ngOnInit() {
    this. fetchUsers();
    // this.initDataTable();
  }
  // ngAfterViewInit(): void {
  //   this.dtTrigger.next();
  // }

  // ngOnDestroy(): void {
  //   // Do not forget to unsubscribe the event
  //   this.dtTrigger.unsubscribe();
  // }
  // rerender(status=''): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     // Destroy the table first
  //     dtInstance.destroy();
  //     if(status === 'reset') {
  //       this.dtOptions.pageLength = this.totalRecords;
  //     } else {
  //       this.dtOptions.pageLength = 10;
  //     }
  //     // Call the dtTrigger to rerender again
  //     this.dtTrigger.next();
  //   });
  // }
  fetchUsers()
{
  this.apiService.getData('users')
  .subscribe({
    complete: () => {
      // this.initDataTable();
    },
    error: () => { },
    next: (result: any) => {

      this.totalRecords = result.Count;
    },
  });
}
// initDataTable() {
//   let current = this;
//   this.dtOptions = { // All list options
//     pagingType: 'full_numbers',
//     pageLength: this.pageLength,
//     serverSide: true,
//     processing: true,
//     order: [],
//     columnDefs: [ //sortable false
//       { "targets": [0, 1, 2, 3, 4, 5, 6, 7], "orderable": false },
//     ],
//     dom: 'lrtip',
//     language: {
//       "emptyTable": "No records found"
//     },
//     ajax: (dataTablesParameters: any, callback) => {
//       current.apiService.getDatatablePostData('users/fetchRecords?userName='+this.userName+ '&currentStatus='+ this.currentStatus+'&departmentName='+this.departmentName+ '&lastKey=' + this.lastEvaluatedKey, dataTablesParameters).subscribe(resp => {
//         current.users = resp['Items'];
//         // let fetchedusers = resp['Items'].map(function(v){ return v.driverID; });
//         for (let i = 0; i < current.users.length; i++) {
//           const element = current.users[i];
//           // element.address = {};
//           // this.apiService.getData(`addresses/driver/${element.driverID}`).subscribe((result: any) => {
//           //   element.address = result['Items'][0];
//           // });
//         }
        
//         if (resp['LastEvaluatedKey'] !== undefined) {
//           this.lastEvaluatedKey = resp['LastEvaluatedKey'].userName;
//         } else {
//           this.lastEvaluatedKey = '';
//         }
        
//         callback({
//           recordsTotal: current.totalRecords,
//           recordsFiltered: current.totalRecords,
//           data: []
//         });
//       });
//     }

//   };
// }
searchFilter() {
  if(this.userName!== '' || this.currentStatus !== '' || this.departmentName !== '' ) {
    this.users= [];
    this.fetchUsers();
    // this.rerender('reset');
  } else {
    return false;
  }
}

resetFilter() {
  if(this.userName!== '' || this.currentStatus !== '' || this.departmentName !== '') {
    this.userName = '';
    this.currentStatus = '';
    this.departmentName = '';
    this.users= [];
    this.fetchUsers();
    // this.rerender();
  } else {
    return false;
  }
}

deleteUser(userName) {
  if (confirm('Are you sure you want to delete?') === true) {
    this.apiService
    .getData(`users/isDeleted/${userName}/`+1)
    .subscribe((result: any) => {
      this.fetchUsers();
      this.users = [];
      // this.rerender();
      this.toastr.success('User Deleted Successfully!');
    });
  }
}
}
