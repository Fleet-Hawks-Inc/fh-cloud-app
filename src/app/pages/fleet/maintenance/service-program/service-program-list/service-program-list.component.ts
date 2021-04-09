import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Constants from '../../../constants';
declare var $: any;
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-service-program-list',
  templateUrl: './service-program-list.component.html',
  styleUrls: ['./service-program-list.component.css'],
})
export class ServiceProgramListComponent implements  OnInit {

  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  title = 'Service Program List';
  // dtOptions: any = {};
  programs = [];
  programeName = '';
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  serviceProgramNext = false;
  serviceProgramPrev = true;
  serviceProgramDraw = 0;
  serviceProgramPrevEvauatedKeys = [''];
  serviceProgramStartPoint = 1;
  serviceProgramEndPoint = this.pageLength;
  suggestions = [];

  constructor(
      private apiService: ApiService,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService
    ) {}

  ngOnInit() {
    this.fetchProgramsCount();
    this.initDataTable();
  }

  fetchProgramsCount() {
    this.apiService.getData('servicePrograms/get/count?programName='+this.programeName).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;

        if(this.programeName != '') {
          this.serviceProgramEndPoint = this.totalRecords;
        }
      },
    });
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('servicePrograms/fetch/records?programName='+this.programeName + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.getStartandEndVal();
        this.programs = result['Items'];
        if (this.programeName != '') {
          this.serviceProgramStartPoint = 1;
          this.serviceProgramEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.serviceProgramNext = false;
          // for prev button
          if (!this.serviceProgramPrevEvauatedKeys.includes(result['LastEvaluatedKey'].programID)) {
            this.serviceProgramPrevEvauatedKeys.push(result['LastEvaluatedKey'].programID);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'].programID;
          
        } else {
          this.serviceProgramNext = true;
          this.lastEvaluatedKey = '';
          this.serviceProgramEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.serviceProgramDraw > 0) {
          this.serviceProgramPrev = false;
        } else {
          this.serviceProgramPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  searchFilter() {
    if (this.programeName !== '') {
      this.programeName = this.programeName.toLowerCase();
      this.dataMessage = Constants.FETCHING_DATA;
      this.programs = [];
      this.fetchProgramsCount();
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.programeName !== '') {
      this.dataMessage = Constants.FETCHING_DATA;
      this.programeName = '';
      this.programs = [];
      this.fetchProgramsCount();
      this.initDataTable();
      this.resetCountResult();
    } else {
      return false;
    }
  }

  deleteProgram(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`servicePrograms/isDeleted/${entryID}/`+1)
      .subscribe((result: any) => {
        this.programs = [];
        this.fetchProgramsCount();
        this.initDataTable();
        this.toastr.success('Service Program Deleted Successfully!');
      });
    }
  }

  getStartandEndVal() {
    this.serviceProgramStartPoint = this.serviceProgramDraw * this.pageLength + 1;
    this.serviceProgramEndPoint = this.serviceProgramStartPoint + this.pageLength - 1;
  }

  // next button func
  nextResults() {
    this.serviceProgramNext = true;
    this.serviceProgramPrev = true;
    this.serviceProgramDraw += 1;
    this.initDataTable();
  }

  // prev button func
  prevResults() {
    this.serviceProgramNext = true;
    this.serviceProgramPrev = true;
    this.serviceProgramDraw -= 1;
    this.lastEvaluatedKey = this.serviceProgramPrevEvauatedKeys[this.serviceProgramDraw];
    this.initDataTable();
  }

  resetCountResult() {
    this.serviceProgramStartPoint = 1;
    this.serviceProgramEndPoint = this.pageLength;
    this.serviceProgramDraw = 0;
  }

  getSuggestions(searchvalue='') {
    this.suggestions = [];
    if(searchvalue !== '') {
      searchvalue = searchvalue.toLowerCase();
      this.apiService.getData('servicePrograms/get/suggestions/'+searchvalue).subscribe({
        complete: () => {},
        error: () => { },
        next: (result: any) => {
          this.suggestions = result.Items;
        }
      })
    } 
  }

  setData(value) {
    this.programeName = value.trim();
    this.suggestions = [];
  }
}
