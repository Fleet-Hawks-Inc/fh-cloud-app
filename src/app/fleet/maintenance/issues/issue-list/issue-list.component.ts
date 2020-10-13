import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../api.service';
import {Router} from '@angular/router';
import { timer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;


@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {
  title = 'Issues List';
  issues: [];
  vehicles: [];
  checked = false;
  isChecked = false;
  headCheckbox = false;
  selectedIssueID: any;
  issueCheckCount = null;
  vehicleName: string;
  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) {}


  ngOnInit() {
    this.fetchIssues();
    this.fetchVehicles();
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
         this.vehicles = result.Items; });
    }
    fetchVehicleName(vID){
    // return this.vehicleName = this.vehicles.filter(vehicle => vehicle.vehicleID === vID);
    }
  fetchIssues() {
    this.apiService.getData('issues').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.issues = result.Items;
      },
    });
  }
  editIssue = () => {
    if (this.issueCheckCount === 1) {
      this.router.navigateByUrl('/fleet/issues/edit-issue/' + this.selectedIssueID);
    } else {
      this.toastr.error('Please select only one asset!');
    }
  }
  deleteIssue = () => {
    console.log('issues', this.issues);
    const selectedIssues = this.issues.filter((product: any) => product.checked).map((p: any) => p.issueID);
    if (selectedIssues && selectedIssues.length > 0) {
      for (const i of selectedIssues) {
        this.apiService.deleteData('issues/' + i).subscribe((result: any) => {
          this.fetchIssues();
          this.toastr.success('Issue Deleted Successfully!');
        });
      }
    }
  }

  uncheckCheckbox = (arr) => {
    arr.forEach(item => {
      item.checked = false;
    });
    this.headCheckbox = false;
  }

  // Count Checkboxes
  checkboxCount = (arr) => {
    this.issueCheckCount = 0;
    arr.forEach(item => {
      console.log('item', item);
      console.log('array', arr);
      if (item.checked === true) {
        this.selectedIssueID = item.issueID;
        this.issueCheckCount = this.issueCheckCount + 1;
        console.log('check', arr.length, this.issueCheckCount);
        if (arr.length === this.issueCheckCount) {
          this.headCheckbox = true;
        }
      } else {
        this.headCheckbox = false;
      }
    });
  }
  // checked-unchecked all checkboxes
  checkuncheckall = (ev) => {
    if (ev.target.checked === true) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }
  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
