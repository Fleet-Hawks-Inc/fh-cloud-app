import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-daily-inspection',
  templateUrl: './edit-daily-inspection.component.html',
  styleUrls: ['./edit-daily-inspection.component.css']
})
export class EditDailyInspectionComponent implements OnInit {
  title = 'Edit Daily Inspection';

  /********** Form Fields ***********/

  inspectionFormID = '';
  parametersA = '';
  parametersB = '';
  driverSignature = '';
  operationableA = '';
  operationableB = '';
  /******************/

  inspectionID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.inspectionID = this.route.snapshot.params['inspectionID'];

    this.apiService.getData('dailyInspections/' + this.inspectionID)
        .subscribe((result: any) => {
          result = result.Items[0];

          this.inspectionFormID = result.inspectionFormID;
          this.parametersA = result.parameters.a;
          this.parametersB = result.parameters.b;
          this.driverSignature = result.driverSignature;
          this.operationableA = result.operationable.a;
          this.operationableB = result.operationable.b;
        });

  }




  updateDailyInspection() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "inspectionID": this.inspectionID,
      'inspectionFormID':  this.inspectionFormID,
      "parameters": {
        'a': this.parametersA,
        'b': this.parametersB
      },
      'driverSignature': this.driverSignature,
      'operationable': {
        'a': this.operationableA,
        'b': this.operationableB
      }
    };

    this.apiService.putData('dailyInspections', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Daily Inspection Updated successfully';

      }
    });
  }
}
