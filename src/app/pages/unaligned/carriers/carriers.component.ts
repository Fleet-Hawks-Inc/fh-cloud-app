import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-carriers',
  templateUrl: './carriers.component.html',
  styleUrls: ['./carriers.component.css']
})
export class CarriersComponent implements OnInit {

  title = 'Carrier List';
  carriers;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchCarriers();

  }

  fetchCarriers() {
    this.apiService.getData('carriers')
        .subscribe((result: any) => {
          this.carriers = result.Items;
        });
  }



  deleteCarrier(carrrierID) {
    this.apiService.deleteData('carriers/' + carrrierID)
        .subscribe((result: any) => {
          this.fetchCarriers();
        })
  }

}
