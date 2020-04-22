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
  groupType = '';
  groupId = '';
  timeCreated = ""
  /******************/

  /**
   * Form errors prop
   */
  validationErrors = {
    groupName: {
      error: false,
    },
    description: {
      error: false,
    },
    groupType: {
      error: false,
    }
  };


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
          this.groupType =  result.groupType;
          this.timeCreated = result.timeCreated
        });
  }

  updateGroup() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "groupID": this.groupId,
      "groupName": this.groupName,
      "description": this.description,
      "groupType": this.groupType,
      timeCreated: this.timeCreated
    };


    this.apiService.putData('groups', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.mapErrors(err.error);
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



  mapErrors(errors) {
    for (var i = 0; i < errors.length; i++) {
      let key = errors[i].path;
      let length = key.length;

      //make array of message to remove the fieldName
      let message = errors[i].message.split(" ");
      delete message[0];

      //new message
      let modifiedMessage = `This field${message.join(" ")}`;

      if (length == 1) {
        //single object
        this.validationErrors[key[0]].error = true;
        this.validationErrors[key[0]].message = modifiedMessage;
      } else if (length == 2) {
        //two dimensional object
        this.validationErrors[key[0]][key[1]].error = true;
        this.validationErrors[key[0]][key[1]].message = modifiedMessage;
      }
    }
    console.log(this.validationErrors);
  }

  updateValidation(first, second = "") {
    if (second == "") {
      this.validationErrors[first].error = false;
    } else {
      this.validationErrors[first][second].error = false;
    }
  }

}
