import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-entry',
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.css']
})
export class EditEntryComponent implements OnInit {
  title = 'Edit Entry';

  /********** Form Fields ***********/

  accountID = '';
  entryType = '';
  drOrCr = '';
  value = '';
  /******************/

  entryID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.entryID = this.route.snapshot.params['entryID'];

    this.apiService.getData('entries/' + this.entryID)
        .subscribe((result: any) => {
          result = result.Items[0];

          this.accountID = result.accountID;
          this.entryType = result.entryType;
          this.drOrCr = result.drOrCr;
          this.value = result.value;


        });

  }




  updateEntry() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "entryID": this.entryID,
      "accountID": this.accountID,
      "entryType": this.entryType,
      "drOrCr" : this.drOrCr,
      "value" : this.value
    };

    this.apiService.putData('entries', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Entry Updated successfully';

      }
    });
  }
}
