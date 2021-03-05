import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Auth } from 'aws-amplify';
import {Router} from '@angular/router';

@Component({
  selector: 'app-all-carriers',
  templateUrl: './all-carriers.component.html',
  styleUrls: ['./all-carriers.component.css']
})
export class AllCarriersComponent implements OnInit {
  carriersList = [];
  constructor(
      private apiService: ApiService, 
      private spinner: NgxSpinnerService,
      public router: Router) { }

  async ngOnInit() {
    this.fetchCarriers();
  }

  fetchCarriers(){
    this.spinner.show();
    this.apiService.getData('carriers').subscribe((result: any) => {
      this.carriersList = result.Items;
      this.spinner.hide();
    });
  }

  Logout() {
    Auth.signOut();
    localStorage.removeItem('vehicle');
    localStorage.removeItem('driver');
    localStorage.removeItem('LoggedIn');
    localStorage.removeItem('user');
    // localStorage.removeItem('jwt');
    this.router.navigate(['/Login']);
     
  }

  selectCarrier(carrierID){
    localStorage.setItem('carrierID', carrierID);
    this.router.navigate(['/Map-Dashboard']);
  }

}
