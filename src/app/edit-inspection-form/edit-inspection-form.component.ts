import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-inspection-form',
  templateUrl: './edit-inspection-form.component.html',
  styleUrls: ['./edit-inspection-form.component.css']
})
export class EditInspectionFormComponent implements OnInit {
  title = 'Edit Inspection Form';

  /********** Form Fields ***********/

  titlee = '';
  description = '';
  /******************/

  inspectionFormID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.inspectionFormID = this.route.snapshot.params['inspectionFormID'];
    console.log(this.route.snapshot.params['inspectionFormID']);
    this.apiService.getData('inspectionForms/' + this.inspectionFormID)
        .subscribe((result: any) => {
          result = result.Items[0];
         
          this.titlee = result.title;
          this.description = result.description;


        });

  }




  updateInspectionForm() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "inspectionFormID": this.inspectionFormID,
      "title": this.titlee,
      "description": this.description
    };

    this.apiService.putData('inspectionForms', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Inspection Form Updated successfully';

      }
    });
  }
}
