import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css']
})
export class EditGroupComponent implements OnInit {

  title = 'Add Group';

  /********** Form Fields ***********/
  groupName = '';
  description = '';
  carrierID = '';
  groupType = '';
  groupId = '';

  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {

    this.groupId = this.route.snapshot.params['groupId'];

    this.apiService.getData('groups/' + this.groupId)
        .subscribe((result: any) => {
          //console.log(result);
          result = result.Items[0];
          this.groupName = result.groupName;
          this.description =  result.description;
          this.carrierID =  result.carrierID;
          this.groupType =  result.groupType;

        });
  }

  updateGroup() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "groupID": this.groupId,
      "groupName": this.groupName,
      "description": this.description,
      "carrierID": 'default',
      "groupType": this.groupType
    };


    this.apiService.putData('groups', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Group Updated successfully';

      }
    });
  }

}
