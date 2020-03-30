import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-documents',
  templateUrl: './add-documents.component.html',
  styleUrls: ['./add-documents.component.css']
})
export class AddDocumentsComponent implements OnInit {

  title = 'Add Documents';

  /********** Form Fields ***********/

  urlDocType = '';
  carrierID = '';
  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}




  addDocument() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "carrierID": this.carrierID,
      "urlDocType": this.urlDocType
    };


    this.apiService.postData('documents', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Document Added successfully';
        this.urlDocType = '';
        this.carrierID = '';
      }
    });
  }
}
