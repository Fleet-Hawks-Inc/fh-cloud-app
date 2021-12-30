import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Constants from 'src/app/pages/fleet/constants';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { from } from 'rxjs'
declare var $: any;

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
  contactID = '';
  setUsrName = '';
  setRoles = [];
  suggestedUsers = [];
  searchUserName = '';
  users: any = [];
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';
  userName = '';
  currentStatus = '';
  departmentName = '';
  companyName = '';
  userNext = false;
  userPrev = true;
  userDraw = 0;
  userPrevEvauatedKeys = [''];
  userStartPoint = 1;
  userEndPoint = this.pageLength;
  userRoles={};
  selectedUserData: any = '';
  newRoles = [];
   searchValue = null;
    lastItemSK = "";
    loaded: boolean = false;

  constructor(private apiService: ApiService, private toastr: ToastrService, private spinner: NgxSpinnerService, private httpClient: HttpClient) { }

  ngOnInit() {
    this.fetchUserRoles();
    this.fetchUsers();
  }

 
  getSuggestions = _.debounce(function (value) {
    this.contactID = '';
    value = value.toLowerCase();
    if (value !== '') {
      this.apiService
        .getData(`contacts/getEmployee/suggestions/${value}`)
        .subscribe((result) => {
          result.map((v) => {
            if (v.lastName === undefined) {
              v.lastName = '';
            }
            return v;
          });
          this.suggestedUsers = result;
        });
    } else {
      this.suggestedUsers = [];
    }
  }, 800);

    setUser(contactID, firstName = "", lastName = "", middleName = "") {
    if (middleName !== "") {
      this.searchUserName = `${firstName} ${middleName} ${lastName}`;
      // this.contactID = contactID;
      this.contactID = `${firstName} ${middleName} ${lastName}`;
    } else {
      this.searchUserName = `${firstName} ${lastName}`;
      this.contactID = `${firstName} ${lastName}`;
    }
    this.suggestedUsers = [];
  }
  
  fetchUsers() {
    this.apiService.getData('contacts/get/employee/count/?searchValue=' + this.contactID)
      .subscribe({
        complete: () => { },
        error: () => { },
        next: (result: any) => {
          this.totalRecords = result.Count;
          if (this.contactID !== '') {
            this.userEndPoint = this.totalRecords;
          }
          this.initDataTable();
        },
      });
  }
  async fetchUserRoles() {
    const data:any=await this.httpClient.get('assets/jsonFiles/user/userRoles.json').toPromise();
    console.log(data)
data.forEach(element => {
  this.userRoles[element.role]=element.name
});
  }

  fetchRole(user: any) {
    this.fetchUserRoles();
    this.selectedUserData = user;
    this.setUsrName = user.userLoginData.userName;
    this.setRoles = user.userLoginData.userRoles;

  }
  cancel() {
    $('#assignrole').modal('hide');

  }
  assignRole() {
    this.selectedUserData.userLoginData.userRoles = this.setRoles;

    this.apiService.putData('contacts/assignRole', this.selectedUserData).
      subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                //  val.message = val.message.replace(/".*"/, 'This Field');
              })
            )
            .subscribe({
              complete: () => {

              },
              error: () => {

              },
              next: () => { },
            });
        },
        next: (res) => {
          // this.spinner.hide();
          this.toastr.success('Role is updated successfully');
          $('#assignrole').modal('hide');
          this.fetchUsers();
        }
      });
  }
  
  initDataTable() {
    if (this.lastItemSK !== 'end'){
    this.apiService.getData(`contacts/fetch/employee/records?searchValue=${this.contactID}&lastKey=${this.lastItemSK}`)
      .subscribe((result: any) => {
        console.log('abc', result)
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        if (result.Items.length > 0) {
                if (result.LastEvaluatedKey !== undefined) {
                    this.lastItemSK = encodeURIComponent(result.LastEvaluatedKey.contactSK);
                }
                else {
                    this.lastItemSK = 'end'
                }
             this.users = this.users.concat(result.Items);
            this.loaded = true;
        }
      })
    }
  }
  
   searchFilter() {
    if (this.searchValue !== null) {
     this.searchValue = this.searchValue.toLowerCase();
               if (this.contactID == '') 
               {
               this.contactID = this.searchValue;
                }
                
      this.users = [];
      this.lastItemSK = '';
      this.initDataTable();
    } else {
      return false;
    }
  }
  
  onScroll() {
    if (this.loaded) {
      this.initDataTable();
    }
    this.loaded = false;
  }

  resetFilter() {
    if (this.searchValue !== '') {
      this.searchValue = null;
      this.contactID = '';
      this.users = [];
      this.lastItemSK = '';
      this.initDataTable();
    } else {
      return false;
    }
  }

  async deleteUser(contactID, firstName: string, lastName: string, userName: string) {
    if (confirm('Are you sure you want to delete?') === true) {
      await this.apiService
        .deleteData(`contacts / delete /user/${contactID} /${firstName}/${lastName} /${userName}`)
        .subscribe(async (result: any) => {
          this.userDraw = 0;
          this.lastEvaluatedKey = '';
          this.dataMessage = Constants.FETCHING_DATA;
          this.users = [];
          this.fetchUsers();
          this.toastr.success('User deleted successfully');
        });
    }
  }
  getStartandEndVal() {
    this.userStartPoint = this.userDraw * this.pageLength + 1;
    this.userEndPoint = this.userStartPoint + this.pageLength - 1;
  }

  resetCountResult() {
    this.userStartPoint = 1;
    this.userEndPoint = this.pageLength;
    this.userDraw = 0;
  }
}
