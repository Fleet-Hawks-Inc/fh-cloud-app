import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Auth } from 'aws-amplify';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-carriers',
  templateUrl: './all-carriers.component.html',
  styleUrls: ['./all-carriers.component.css']
})
export class AllCarriersComponent implements OnInit {
  carriersList = [];
  pendingCarriersList = [];
  carrierNameList: any  = {};
  dataMessage = 'Fetching Data.....';
  constructor(
      private apiService: ApiService,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
      public router: Router) { }

  async ngOnInit() {
    this.fetchCarriers();
    this.carrierNameListFn();
  }

  fetchCarriers(){
    this.spinner.show();
    this.apiService.getData('carriers').subscribe((result: any) => {
      if(result.Items.length == 0) {
        this.dataMessage = 'No Data Found';
      }
      this.carriersList = result.Items;
      this.pendingCarriersList = this.carriersList.filter( e => e.penAscCmp.length > 0);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });

  }
  carrierNameListFn() {
    this.apiService.getData('carriers/get/list').subscribe((result: any) => {
      this.carrierNameList = result;
    });
  }
  approveCarrier(carrierID) {
    this.apiService.getData(`carriers/approvecarrier/${carrierID}`).subscribe((result:any) => {
      if(result) {
        this.toastr.success('Carrier and associated company(s) approved.');
      }
    });
  }
  Logout() {
    Auth.signOut();
    localStorage.removeItem('vehicle');
    localStorage.removeItem('driver');
    localStorage.removeItem('LoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('carrierID')
    // localStorage.removeItem('jwt');
    this.router.navigate(['/Login']);

  }

  selectCarrier(carrierID, carrierBusiness){
    localStorage.setItem('carrierID', carrierID);
    localStorage.setItem('carrierBusiness', carrierBusiness);
    this.router.navigate(['/Map-Dashboard']);
  }

}
