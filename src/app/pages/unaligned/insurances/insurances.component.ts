import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-insurances',
  templateUrl: './insurances.component.html',
  styleUrls: ['./insurances.component.css']
})
export class InsurancesComponent implements OnInit {

  title = 'insurance List';
  insurances;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchinsurances();

  }

  fetchinsurances() {
    this.apiService.getData('insurances')
        .subscribe((result: any) => {
          this.insurances = result.Items;
        });
  }



  deleteInsurance(documentId) {
    this.apiService.deleteData('insurances/' + documentId)
        .subscribe((result: any) => {
          this.fetchinsurances();
        })
  }

}
