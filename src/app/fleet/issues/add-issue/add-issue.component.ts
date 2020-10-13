import { Component, OnInit } from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../api.service';
declare var $: any;
@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.css']
})
export class AddIssueComponent implements OnInit {
  title = 'Add Issue';

  /**
   * Issue Prop
   */
  issueName = '';
  vehicle = '';
  reportedDate = '';
  description = '';
  odometer = '';
  reportedBy = '';
  assinedTo = '';
  // date: NgbDateStruct;
  vehicles = [];
  response : any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success  = '';
  // date: {year: number, month: number};
  constructor(   
             private apiService: ApiService,
          
              ) { }
 

  ngOnInit() {
    this.fetchVehicles();
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
         this.vehicles = result.Items; });
    }
  addIssue(){
    this.hasError = false;
    this.hasSuccess = false;
    const data = {
      issueName: this.issueName,
      vehicle: this.vehicle,
      reportedDate: this.reportedDate,
      description: this.description,
      odometer: this.odometer,
      reportedBy: this.reportedBy,
      assinedTo: this.assinedTo
    }
    console.log('Issue data on console', data);
    return;
    this.apiService.postData('issues', data).
  subscribe({
    complete : () => {},
    error : (err) => {
      this.hasError = true;
      this.Error = err.error;
    },
    next: (res) => {
      this.response = res;
      this.hasSuccess = true;
      this.Success = 'Issue Added successfully';


    }
  });
}
}
