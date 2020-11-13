import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-e-manifests',
  templateUrl: './e-manifests.component.html',
  styleUrls: ['./e-manifests.component.css']
})
export class EManifestsComponent implements OnInit {
 activeDiv = 'ace';
 countries = [];
 ACEList = [];
 ACIList = [];
   constructor(  private apiService: ApiService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchCountries();
    this.ACEEntries();
    this.ACIEntries();
  }
  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
    });
  }
  ACEEntries() {
    this.apiService.getData('ACEeManifest').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        console.log(result);
        this.ACEList = result.Items;
        console.log(this.ACEList);
      },
    });
  }
  ACIEntries() {
    this.apiService.getData('ACIeManifest').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        console.log(result);
        this.ACIList = result.Items;
        console.log(this.ACIList);
      },
    });
  }
  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
