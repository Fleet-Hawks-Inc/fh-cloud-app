import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-inspection-form',
  templateUrl: './add-inspection-form.component.html',
  styleUrls: ['./add-inspection-form.component.css']
})
export class AddInspectionFormComponent implements OnInit {

  title = 'Add Inspection Forms';

  /********** Form Fields ***********/

  titlee = '';
  description = '';
  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}




  addInspectionForm() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "title": this.titlee,
      "description": this.description
    };


    this.apiService.postData('inspectionForms', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Inspection Form Added successfully';
        this.titlee = '';
        this.description = '';
      }
    });
  }
}
