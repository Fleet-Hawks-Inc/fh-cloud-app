import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-daily-inspection',
  templateUrl: './add-daily-inspection.component.html',
  styleUrls: ['./add-daily-inspection.component.css']
})
export class AddDailyInspectionComponent implements OnInit {
  title = 'Add Daily Inspection';

  /********** Form Fields ***********/

  inspectionFormID = '';
  parametersA = '';
  parametersB = '';
  driverSignature = '';
  operationableA = '';
  operationableB = '';
  /******************/


  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';

  constructor(private apiService: ApiService,
    private router: Router) { }

  ngOnInit() { }




  addDocument() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      'inspectionFormID': this.inspectionFormID,
      'parameters': {
        'a': this.parametersA,
        'b': this.parametersB
      },
      'driverSignature': this.driverSignature,
      'operationable': {
        'a': this.operationableA,
        'b': this.operationableB
      }
    };


    this.apiService.postData('dailyInspections', data).
      subscribe({
        complete: () => { },
        error: (err) => {
          this.hasError = true;
          this.Error = err.error;
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          this.Success = 'Daily Inspection Added successfully';
          this.inspectionFormID = '';
          this.parametersA = '';
          this.parametersB = '';
          this.driverSignature = '';
          this.operationableA = '';
          this.operationableB = '';
        }
      });
  }

}
