import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css'],
})
export class ModelListComponent implements OnInit {
  title = 'Models List';
  models = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchModels();
  }

  fetchModels() {
    this.apiService.getData('vehicleModels').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.models = result.Items;
      },
    });
  }

  deleteModel(modelID) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService.deleteData('vehicleModels/' + modelID).subscribe((result: any) => {
      this.fetchModels();
    });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
