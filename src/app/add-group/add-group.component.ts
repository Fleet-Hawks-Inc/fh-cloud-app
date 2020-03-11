import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {
  title = 'Add Group';

  /********** Form Fields ***********/
  groupName = '';
  description = '';
  carrierID = '';
  groupType = '';

  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}

  addGroup() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "groupName": this.groupName,
      "description": this.description,
      "carrierID": "default",
      "groupType": this.groupType
    };


    this.apiService.postData('groups', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Group Added successfully';

        this.groupName = '';
        this.description = '';
        this.groupType = '';




      }
    });
  }


}
