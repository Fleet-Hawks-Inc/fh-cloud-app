import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-documents',
  templateUrl: './edit-documents.component.html',
  styleUrls: ['./edit-documents.component.css']
})
export class EditDocumentsComponent implements OnInit {
  title = 'Edit Expense Type';

  /********** Form Fields ***********/

  urlDocType = '';
  carrierID = '';
  /******************/

  docID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.docID = this.route.snapshot.params['documentId'];

    this.apiService.getData('documents/' + this.docID)
        .subscribe((result: any) => {
          result = result.Items[0];

          this.carrierID = result.carrierID;
          this.urlDocType = result.urlDocType;


        });

  }




  updateDocumemnt() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "docID": this.docID,
      "carrierID": this.carrierID,
      "urlDocType": this.urlDocType
    };

    this.apiService.putData('documents', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Document Updated successfully';

      }
    });
  }
}
