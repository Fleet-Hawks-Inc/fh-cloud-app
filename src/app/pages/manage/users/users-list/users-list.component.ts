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
  userRoles: any;
  selectedUserData: any = '';
  newRoles = [];
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
  constructor(private apiService: ApiService, private toastr: ToastrService, private spinner: NgxSpinnerService, private httpClient: HttpClient) { }

  ngOnInit() {
    this.fetchUsers();
  }



  setUser(contactID, firstName, lastName) {
    this.searchUserName = firstName + ' ' + lastName;
    // this.driverID = driverID;
    this.contactID = firstName + '-' + lastName;
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
  fetchUserRoles() {
    this.httpClient.get('assets/jsonFiles/user/userRoles.json').subscribe((data: any) => {
      this.userRoles = data;
    }
    );

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
   // this.spinner.show();
    this.apiService.getData('contacts/fetch/employee/records?searchValue=' + this.contactID + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.users = result[`Items`];
        this.users.map((v: any) => {
if (v.userLoginData.userRoles.length > 0) {
for (const element of v.userLoginData.userRoles) {
    const role = element.split('_');
    const newRole = role[1];
    this.newRoles.push(newRole);
  }
v.userLoginData.userRoles = this.newRoles;
this.newRoles = [];
}
        });
        if (this.contactID !== '' || this.departmentName !== '') {
          this.userStartPoint = 1;
          this.userEndPoint = this.totalRecords;
        }

        if (result[`LastEvaluatedKey`] !== undefined) {
          const lastEvalKey = result[`LastEvaluatedKey`].contactSK.replace(/#/g, '--');
          this.userNext = false;
          // for prev button
          if (!this.userPrevEvauatedKeys.includes(lastEvalKey)) {
            this.userPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKey = lastEvalKey;

        } else {
          this.userNext = true;
          this.lastEvaluatedKey = '';
          this.userEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.userDraw > 0) {
          this.userPrev = false;
        } else {
          this.userPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  searchFilter() {
    if (this.searchUserName !== '') {
      this.users = [];
      this.fetchUsers();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.searchUserName !== '') {
      this.searchUserName = '';
      this.contactID = '';
      this.users = [];
      this.fetchUsers();
    } else {
      return false;
    }
  }
  async deleteUser(contactID, firstName: string, lastName: string) {
    if (confirm('Are you sure you want to delete?') === true) {
      await this.apiService
        .deleteData(`contacts/delete/user/${contactID}/${firstName}/${lastName}`)
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

  // next button func
  nextResults() {
    this.userDraw += 1;
    this.initDataTable();
    this.getStartandEndVal();
  }

  // prev button func
  prevResults() {
    this.userDraw -= 1;
    this.lastEvaluatedKey = this.userPrevEvauatedKeys[this.userDraw];
    this.initDataTable();
    this.getStartandEndVal();
  }

  resetCountResult() {
    this.userStartPoint = 1;
    this.userEndPoint = this.pageLength;
    this.userDraw = 0;
  }
}
