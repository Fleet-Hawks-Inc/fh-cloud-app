import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'app-edit-insurance',
  templateUrl: './edit-insurance.component.html',
  styleUrls: ['./edit-insurance.component.css']
})
export class EditInsuranceComponent implements OnInit {
  title = 'Edit Insurance';

  /********** Form Fields ***********/

  vehicleID = '';
  dueDate = '';
  insuranceAmount=  '';
  vendorID = '';
  /******************/

  insuranceID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.insuranceID = this.route.snapshot.params['insuranceID'];

    this.apiService.getData('insurances/' + this.insuranceID)
        .subscribe((result: any) => {
          result = result.Items[0];

          this.vehicleID = result.vehicleID;
          this.dueDate = result.dueDate;
          this.insuranceAmount = result.insuranceAmount;
          this.vendorID = result.vendorID


        });

  }




  updateInsurance() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      'insuranceID': this.insuranceID,
      'vehicleID': this.vehicleID,
      'dueDate': this.dueDate,
      'insuranceAmount': this.insuranceAmount,
      'vendorID': this.vendorID,
    };

    this.apiService.putData('insurances', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Insurance Updated successfully';

      }
    });
  }
}
