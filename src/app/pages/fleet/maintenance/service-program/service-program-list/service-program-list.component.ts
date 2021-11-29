import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Constants from '../../../constants';
declare var $: any;
import { environment } from '../../../../../../environments/environment';
import * as _ from 'lodash';
@Component({
  selector: 'app-service-program-list',
  templateUrl: './service-program-list.component.html',
  styleUrls: ['./service-program-list.component.css'],
})
export class ServiceProgramListComponent implements OnInit {

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
  loaded = false
  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.fetchProgramsCount();
  }

  fetchProgramsCount() {
    this.apiService.getData('servicePrograms/get/count?programName=' + this.programeName).subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.totalRecords = result.Count;

        if (this.programeName != '') {
          this.serviceProgramEndPoint = this.totalRecords;
        }

        this.initDataTable();
      },
    });
  }


  initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
      this.apiService.getData('servicePrograms/fetch/records?programName=' + this.programeName + '&lastKey=' + this.lastEvaluatedKey)
        .subscribe((result: any) => {
          if (result.Items.length === 0) {

            this.dataMessage = Constants.NO_RECORDS_FOUND
          }
          this.suggestions = [];
          if (result.Items.length > 0) {

            if (result.LastEvaluatedKey !== undefined) {
              this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].programID);
            }
            else {
              this.lastEvaluatedKey = 'end'
            }
            this.programs = this.programs.concat(result.Items)

            this.loaded = true;
          }
        });
    }
  }
  onScroll() {
    if (this.loaded) {
      this.fetchProgramsCount();
    }
    this.loaded = false;
  }

  searchFilter() {
    if (this.programeName !== '') {
      this.programeName = this.programeName.toLowerCase();
      this.dataMessage = Constants.FETCHING_DATA;
      this.programs = [];
      this.lastEvaluatedKey = ''
      this.fetchProgramsCount();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.programeName !== '') {
      this.dataMessage = Constants.FETCHING_DATA;
      this.programeName = '';
      this.programs = [];
      this.lastEvaluatedKey = ''
      this.fetchProgramsCount();

    } else {
      return false;
    }
  }

  deleteProgram(entryID, programName) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
        .deleteData(`servicePrograms/isDeleted/${entryID}/${programName}/` + 1)
        .subscribe((result: any) => {
          this.programs = [];
          this.serviceProgramDraw = 0;
          this.lastEvaluatedKey = '';
          this.dataMessage = Constants.FETCHING_DATA;
          this.fetchProgramsCount();
          this.toastr.success('Service Program Deleted Successfully!');
        });
    }
  }


  getSuggestions = _.debounce(function (searchvalue) {
    this.suggestions = [];
    if (searchvalue !== '') {
      searchvalue = searchvalue.toLowerCase();
      this.apiService.getData('servicePrograms/get/suggestions/' + searchvalue).subscribe({
        complete: () => { },
        error: () => { },
        next: (result: any) => {
          this.suggestions = result;
        }
      })
    }
  }, 800)

  setData(value) {
    this.programeName = value.trim();
    this.suggestions = [];
  }

  refreshData() {
    this.dataMessage = Constants.FETCHING_DATA;
    this.programeName = '';
    this.programs = [];
    this.lastEvaluatedKey = '';
    this.fetchProgramsCount();

  }
}
