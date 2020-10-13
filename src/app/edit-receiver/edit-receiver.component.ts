import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-receiver',
  templateUrl: './edit-receiver.component.html',
  styleUrls: ['./edit-receiver.component.css']
})
export class EditReceiverComponent implements OnInit {
  title = 'Edit Receiver';

  /********** Form Fields ***********/

  receiverName = '';
  address = '';
  phone = '';
  fax = '';
  email = '';
  taxID = '';
  /******************/

  receiverID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.receiverID = this.route.snapshot.params['receiverID'];

    this.apiService.getData('receivers/' + this.receiverID)
        .subscribe((result: any) => {
          result = result.Items[0];

          this.receiverName = result.receiverName;
          this.address = result.address;
          this.phone = result.phone;
          this.fax = result.fax;
          this.email = result.email;
          this.taxID = result.taxID;
        });

  }




  updateReceiver() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "receiverID": this.receiverID,
      "receiverName": this.receiverName,
      "address": this.address,
      "phone": this.phone,
      "fax": this.fax,
      "email": this.email,
      "taxID": this.taxID,
    };

    this.apiService.putData('receivers', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Receiver Updated successfully';

      }
    });
  }
}
