import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { ApiService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Constants from 'src/app/pages/fleet/constants';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { from } from 'rxjs'
import * as moment from 'moment'
import { Table } from 'primeng/table';
declare var $: any;

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  @ViewChild('ut') table: Table;
  dataMessage: string = Constants.FETCHING_DATA;
  contactID = '';
  setUsrName = '';
  setRoles = [];
  suggestedUsers = [];
  searchUserName = '';
  users: any = [];
  filterUsers: any = [];
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
  userRoles = {};
  selectedUserData: any = '';
  selectedUser = {
    userID: '',
    userRoles: {},
  }
  newRoles = [];
  searchValue = '';
    get = _.get;
  _selectedColumns: any[];
  queryValue = '';
  lastItemSK = "";
  loaded: boolean = false;
  roles: any = [];
  response: any = '';
  reminderID: any;
  allSubRoles = []
  subRole = []
  dataColumns = 
  [
  { field: 'employeeID', header: 'Employee ID', type: 'text' },
  { field: 'name', header: 'Name', type: 'text' },
  { field: 'userLoginData.userName', header: 'Username', type: 'text' },
  { field: 'userType', header: 'UserType', type: 'text' },
  { field: 'userAccount.department', header: 'Department', type: 'text' },
  { field: 'userSub', header: 'User Roles', type: 'text' },
  { field: 'workPhone', header: 'Phone', type: 'text' },
  { field: 'workEmail', header: 'Email', type: 'text' },
  { field: 'currentStatus', header: 'Status', type: 'text' },
  ];

  constructor(private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private httpClient: HttpClient,
  ) { }

  ngOnInit(): void {
    this.fetchUserRoles();
    this.setToggleOptions();
    this.fetchRoles();
    this.initDataTable();
    this.fetchSubRoles();
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

  setUser(data: any) {
    this.searchValue = `${data.firstName} ${data.lastName}`;
    this.searchValue = this.searchValue.toLowerCase().trim();
    this.contactID = data.contactID;
    this.suggestedUsers = [];
  }

  async fetchUserRoles() {
    const data: any = await this.httpClient.get('assets/jsonFiles/user/userRoles.json').toPromise();
    data.forEach(element => {
      this.userRoles[element.role] = element.name
    });
  }

  async fetchSubRoles() {
    const data: any = await this.httpClient.get('assets/jsonFiles/user/subRoles.json').toPromise()
    data.forEach(element => {
      this.userRoles[element.role] = element.name
    })
    this.allSubRoles = data
  }

  fetchRoles() {
    this.httpClient.get('assets/jsonFiles/user/userRoles.json').subscribe((data: any) => {
      this.roles = data;
    });
  }

  fetchRole(user: any) {
    this.selectedUserData = user;
    this.setUsrName = user.userLoginData.userName;
    if (this.setUsrName == '') {
      this.setUsrName = user.workEmail;
    }
    this.selectedUser.userID = user.contactID;
    const checkArray = user.userLoginData.userRoles;
    let roles = []
    let subRoles = []
    for (const element of checkArray) {
      for (const el of this.roles) {
        if (element == el.role && !roles.includes(element)) {
          roles.push(element)
        }
      }
      for (const e of this.allSubRoles) {
        if (element == e.role && !subRoles.includes(element)) {
          subRoles.push(element)
        }
      }
    }
    this.subRole = subRoles
    this.setRoles = roles

  }

  cancel() {
    $('#assignrole').modal('hide');
  }

  assignRole() {
    this.selectedUser.userRoles = this.setRoles.concat(this.subRole);
    this.apiService.putData('contacts/assignRole', this.selectedUser).
      subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
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
          this.response = res;
          this.toastr.success('Role is assigned successfully');
          $('#assignrole').modal('hide');
          this.users.filter(elem => {
            if (elem.contactID === this.selectedUser.userID) {
              elem.userLoginData.userRoles = this.selectedUser.userRoles;
            }
          })

        }
      });
  }

  async initDataTable() {
    if (this.lastItemSK !== 'end') {
      if (this.searchValue != '') {
        this.queryValue = this.searchValue;
      }
      await this.apiService.getData(`contacts/fetch/employee/records?searchValue=${encodeURIComponent(this.queryValue)}&lastKey=${this.lastItemSK}`)
        .subscribe((result: any) => {
          if (result.Items.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            this.loaded = true;
          }
          if (result.Items.length > 0) {
            if (result.LastEvaluatedKey !== undefined) {
              this.lastItemSK = encodeURIComponent(result.LastEvaluatedKey.contactSK);
            }
            else {
              this.lastItemSK = 'end'
            }
            this.users = this.users.concat(result.Items);
            this.filterUsers = this.users;
            this.loaded = true;
          }
        })
    }
  }

  searchFilter() {
    this.lastItemSK = '';
    this.users = [];
    this.suggestedUsers = [];
    this.dataMessage = Constants.FETCHING_DATA;
    this.initDataTable();
  }
 
   refreshData() {
    this.users = [];
    this.lastItemSK = '';
    this.loaded = false;
    this.initDataTable();
    this.dataMessage = Constants.FETCHING_DATA;
  }
  
 
  onScroll = async(event: any) => {
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
      this.suggestedUsers = [];
      this.dataMessage = Constants.NO_RECORDS_FOUND;
      this.initDataTable();
    } else {
      return false;
    }
  }

  async deleteUser(contactID) {
    if (confirm('Are you sure you want to delete?') === true) {
      await this.apiService
        .deleteData(`contacts/delete/user/${contactID}`)
        .subscribe(async (result: any) => {
          this.userDraw = 0;
          this.lastEvaluatedKey = '';
          this.dataMessage = Constants.FETCHING_DATA;
          this.users = [];
          this.lastItemSK = '';
          this.initDataTable();
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
  
  
  
      /**
     * Clears the table filters
     * @param table Table 
     */
    clear(table: Table) {
        table.clear();
    }
}
