import { Component, OnInit, AfterViewInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../api.service";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
import {AwsUploadService} from '../../../aws-upload.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-edit-documents',
  templateUrl: './edit-documents.component.html',
  styleUrls: ['./edit-documents.component.css']
})
export class EditDocumentsComponent implements OnInit,AfterViewInit {
  title = 'Edit Document';

  /********** Form Fields ***********/
 
  imageError = '';
  fileName = '';
  errors = {};
  form;
  documentType = '';
  /******************/

  docID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService,
              private awsUS: AwsUploadService) { }


  ngOnInit() {
    this.docID = this.route.snapshot.params['documentID'];

    this.apiService.getData('documents/' + this.docID)
        .subscribe((result: any) => {
          result = result.Items[0];

          this.documentType = result.documentType;


        });

  }
  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }




  updateDocument() {
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
    this.apiService.putData('documents', data).
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
        this.Success = 'Document Updated successfully';
        this.documentType = '';
       
      }
    });
  }
  throwErrors() {
    this.form.showErrors(this.errors);
  }

  // uploadFile(event) {
  //   this.imageError = '';
  //   if (this.awsUS.imageFormat(event.target.files.item(0)) !== -1) {
  //     this.fileName = this.awsUS.uploadFile('test', event.target.files.item(0));
  //   } else {
  //     this.fileName = '';
  //     this.imageError = 'Invalid Document Format';
  //   }
  // }
}
