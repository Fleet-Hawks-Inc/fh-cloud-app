import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../api.service";
import {Router} from "@angular/router";
import { timer } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-factoring-company-list',
  templateUrl: './factoring-company-list.component.html',
  styleUrls: ['./factoring-company-list.component.css']
})
export class FactoringCompanyListComponent implements OnInit {

  title = 'Factoring Company List';
  factoringCompany = [];

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.fetchFactoringCompany();
  }

  fetchFactoringCompany() {
    this.apiService.getData('factoringCompanies')
        .subscribe({
          complete: () => {
            this.initDataTable();
          },
          error: () => {},
          next: (result: any) => {
            console.log(result);
            this.factoringCompany = result.Items;
          },
        });
  }

  deleteFactoringCompany(factoringCompanyID) {

         /******** Clear DataTable ************/
         if ($.fn.DataTable.isDataTable('#datatable-default')) {
          $('#datatable-default').DataTable().clear().destroy();
          }
          /******************************/

    this.apiService.deleteData('factoringCompanies/' + factoringCompanyID)
        .subscribe((result: any) => {
          this.fetchFactoringCompany();
        });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }

}
