import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";

@Component({
  selector: "app-edit-item-group",
  templateUrl: "./edit-item-group.component.html",
  styleUrls: ["./edit-item-group.component.css"],
})
export class EditItemGroupComponent implements OnInit {
  title = "Edit Item Group";

  /********** Form Fields ***********/
  groupID = "";
  groupName = "";
  description = "";
  timeCreated = "";
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
  };

  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.groupID = this.route.snapshot.params["groupID"];

    this.apiService
      .getData("itemGroups/" + this.groupID)
      .subscribe((result: any) => {
        result = result.Items[0];

        this.groupName = result.groupName;
        this.description = result.description;
        this.timeCreated = result.timeCreated
      });
  }

  updateGroup() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      groupID: this.groupID,
      groupName: this.groupName,
      description: this.description,
      timeCreated: this.timeCreated,
    };

    this.apiService.putData("itemGroups", data).subscribe({
      complete: () => {},
      error: (err) => {
        this.mapErrors(err.error);
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Item Group updated successfully";
      },
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
