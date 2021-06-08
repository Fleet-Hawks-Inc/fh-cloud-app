import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { OnboardDefaultService } from '../../../../../services/onboard-default.service'
import  Constants  from '../../../../fleet/constants';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-inspection',
  templateUrl: './list-inspection.component.html',
  styleUrls: ['./list-inspection.component.css']
})
export class ListInspectionComponent implements OnInit {
  public inspectionForms: any = [];
  totalRecords = 0;
  pageLength = 10;
  lastEvaluatedKey = '';
  inspectionsLength = 0;
  inspectionNext = false;
  inspectionPrev = true;
  inspectionDraw = 0;
  inspectionPrevEvauatedKeys = [''];
  inspectionStartPoint = 1;
  inspectionEndPoint = this.pageLength;
  dataMessage: string = Constants.FETCHING_DATA;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private onboard: OnboardDefaultService,
    private route: ActivatedRoute) { }


  ngOnInit() {

    this.onboard.checkInspectionForms();
    this.fetchCount();
  }

  fetchCount() {
    this.apiService.getData('inspectionForms/get/count').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count; 
        this.initDataTable();
      },
    });
  }

  deleteForm(id) {
    if (confirm('Are you sure you want to delete')) {
      this.apiService.getData('inspectionForms/delete/form/' + id).subscribe((result) => {
        this.inspectionForms = [];
        this.dataMessage = Constants.FETCHING_DATA;
        this.inspectionDraw = 0;
        this.lastEvaluatedKey = '';
        this.fetchCount();
        this.toastr.success("Inspection form deleted successfully");
      })
    }
  }

  initDataTable() {
    this.apiService.getData('inspectionForms/fetch/records?lastEvaluatedKey=' + this.lastEvaluatedKey).subscribe((result: any) => {
      if (result.Items.length == 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
      this.getStartandEndVal();
      this.inspectionForms = result['Items'];

      if (result['LastEvaluatedKey'] !== undefined) {
        let lastEvalKey = result[`LastEvaluatedKey`].inspectionFormSK.replace(/#/g,'--');
        this.inspectionNext = false;
        // for prev button
        if (!this.inspectionPrevEvauatedKeys.includes(lastEvalKey)) {
          this.inspectionPrevEvauatedKeys.push(lastEvalKey);
        }
        this.lastEvaluatedKey = lastEvalKey;

      } else {
        this.inspectionNext = true;
        this.lastEvaluatedKey = '';
        this.inspectionEndPoint = this.totalRecords;
      }

      if (this.totalRecords < this.inspectionEndPoint) {
        this.inspectionEndPoint = this.totalRecords;
      }

      // disable prev btn
      if (this.inspectionDraw > 0) {
        this.inspectionPrev = false;
      } else {
        this.inspectionPrev = true;
      }
    }, err => {
    });
  }

  getStartandEndVal() {
    this.inspectionStartPoint = this.inspectionDraw * this.pageLength + 1;
    this.inspectionEndPoint = this.inspectionStartPoint + this.pageLength - 1;
  }

  // next button func
  nextResults() {
    this.inspectionNext = true;
    this.inspectionPrev = true;
    this.inspectionDraw += 1;
    this.initDataTable();
  }

  // prev button func
  prevResults() {
    this.inspectionNext = true;
    this.inspectionPrev = true;
    this.inspectionDraw -= 1;
    this.lastEvaluatedKey = this.inspectionPrevEvauatedKeys[this.inspectionDraw];
    this.initDataTable();
  }

  resetCountResult() {
    this.inspectionStartPoint = 1;
    this.inspectionEndPoint = this.pageLength;
    this.inspectionDraw = 0;
  }

}
