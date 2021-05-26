import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Constants from 'src/app/pages/fleet/constants';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
 contactID = '';
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

  constructor(private apiService: ApiService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.fetchUsers();
    this.initDataTable();
  }

  fetchUsers() {
    this.apiService.getData('contacts/get/count/employee?searchValue=' + this.contactID + '&companyName=' + this.companyName.toLowerCase())
      .subscribe({
        complete: () => {},
        error: () => { },
        next: (result: any) => {
          this.totalRecords = result.Count;
          console.log('this.totalRecords', this.totalRecords);
        },
      });
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('contacts/fetch/records/employee?searchValue=' + this.contactID + '&companyName=' + this.companyName.toLowerCase() + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.users = result[`Items`];
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
    if (this.userName !== '' || this.currentStatus !== '' || this.departmentName !== '') {
      this.users = [];
      this.fetchUsers();
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.userName !== '' || this.currentStatus !== '' || this.departmentName !== '') {
      this.userName = '';
      this.currentStatus = '';
      this.departmentName = '';
      this.users = [];
      this.fetchUsers();
      this.initDataTable();
    } else {
      return false;
    }
  }

  deleteUser(userName) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
        .getData(`users/isDeleted/${userName}/` + 1)
        .subscribe((result: any) => {
          this.users = [];
          this.fetchUsers();
          this.initDataTable();
          this.toastr.success('User Deleted Successfully!');
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
