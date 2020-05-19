import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../api.service";
import { Router } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
import {AwsUploadService} from '../../../aws-upload.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-add-documents',
  templateUrl: './add-documents.component.html',
  styleUrls: ['./add-documents.component.css']
})
export class AddDocumentsComponent implements OnInit {

  title = 'Add Document';
 
  imageError = '';
  fileName = '';
  errors = {};
  form;
  /********** Form Fields ***********/

  documentType = '';

  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router,
              private awsUS: AwsUploadService) {}

  ngOnInit() {}




  addDocument() {
    if (this.fileName === '') {
      this.imageError = 'Please Choose Document To Upload';
      return;
    }
    this.errors = {};

    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      documentType: this.documentType
    };

   console.log(data);
    this.apiService.postData('documents', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              // this.errors[key] = val.message;
              // Or We Can Use This One To Extract Key
              // const key = this.concatArray(path);
              // this.errors[this.concatArray(path)] = val.message;
              // if (key.length === 2) {
              // this.errors[val.context.key] = val.message;
              // } else {
              // this.errors[key] = val.message;
              // }
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Document Added successfully';
        this.documentType = '';
       
      }
    });
  }
  throwErrors() {
    this.form.showErrors(this.errors);
  }

  uploadFile(event) {
    this.imageError = '';
    if (this.awsUS.imageFormat(event.target.files.item(0)) !== -1) {
      this.fileName = this.awsUS.uploadFile('test', event.target.files.item(0));
    } else {
      this.fileName = '';
      this.imageError = 'Invalid Document Format';
    }
  }
}
