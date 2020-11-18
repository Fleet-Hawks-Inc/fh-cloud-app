import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
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
        console.log('ACE data', this.ACEList);
      },
    });
  }
  deleteACEEntry(entryID) {
    this.apiService
      .deleteData('ACEeManifest/' + entryID)
      .subscribe((result: any) => {
     //   this.spinner.show();
        this.ACEEntries();
        this.toastr.success('ACE eManifest Entry Deleted Successfully!');
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
        console.log('ACI data', this.ACIList);
      },
    });
  }
  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
  deleteACIEntry(entryID) {
    this.apiService
      .deleteData('ACIeManifest/' + entryID)
      .subscribe((result: any) => {
     //   this.spinner.show();
        this.ACIEntries();
        this.toastr.success('ACI eManifest Entry Deleted Successfully!');
      });
  }
}
