import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.css']
})
export class AddEntryComponent implements OnInit {

  title = 'Add Entry';

  /********** Form Fields ***********/

  accountID = '';
  entryType = '';
  drOrCr = '';
  value = '';
  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}




  addEntry() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "accountID": this.accountID,
      "entryType": this.entryType,
      "drOrCr": this.drOrCr,
      "value": this.value
    };


    this.apiService.postData('entries', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Entry Added successfully';
        this.accountID = '';
        this.entryType = '';
        this.drOrCr = '';
        this.value = '';

      }
    });
  }
}
