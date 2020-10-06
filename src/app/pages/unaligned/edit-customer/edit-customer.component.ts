import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  title = 'Edit Customer';

  /********** Form Fields ***********/

  name = '';
  address = '';
  phone = '';
  fax = '';
  email = '';
  taxID = '';
  customerCompanyNo: '';
  /******************/

  customerID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.customerID = this.route.snapshot.params['customerID'];

    this.apiService.getData('customers/' + this.customerID)
        .subscribe((result: any) => {
          result = result.Items[0];

          this.name = result.name;
          this.address = result.address;
          this.phone = result.phone;
          this.fax = result.fax;
          this.email = result.email;
          this.taxID = result.taxID;
          this.customerCompanyNo = result.customerCompanyNo;


        });

  }




  updateCustomer() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      'customerID': this.customerID,
      'name' : this.name,
      'address': this.address,
      'phone': this.phone,
      'fax': this.fax,
      'email': this.email,
      'taxID': this.taxID,
      'customerCompanyNo': this.customerCompanyNo,
    };

    this.apiService.putData('customers', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Customer Updated successfully';

      }
    });
  }
}
