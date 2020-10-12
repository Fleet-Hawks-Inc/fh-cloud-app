import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-insurance',
  templateUrl: './add-insurance.component.html',
  styleUrls: ['./add-insurance.component.css']
})
export class AddInsuranceComponent implements OnInit {

  title = 'Add Insurance';

  /********** Form Fields ***********/

  vehicleID = '';
  dueDate = '';
  insuranceAmount=  '';
  vendorID = '';
  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}




  addInsurance() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      'vehicleID': this.vehicleID,
      'dueDate': this.dueDate,
      'insuranceAmount': this.insuranceAmount,
      'vendorID': this.vendorID
    };


    this.apiService.postData('insurances', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Insurance Added successfully';
        this.vehicleID = '';
        this.dueDate = '';
        this.insuranceAmount = '';
        this.vendorID = '';
      }
    });
  }
}
