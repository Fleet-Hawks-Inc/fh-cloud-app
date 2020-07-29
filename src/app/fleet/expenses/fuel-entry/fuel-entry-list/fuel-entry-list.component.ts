import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from "@angular/common";
import * as moment from "moment";

declare var $: any;

@Component({
  selector: "app-fuel-entry-list",
  templateUrl: "./fuel-entry-list.component.html",
  styleUrls: ["./fuel-entry-list.component.css"],
  providers: [DatePipe]
})
export class FuelEntryListComponent implements OnInit {
  title = "Fuel Entries List";
  // fromDate: NgbDateStruct;
  // toDate: NgbDateStruct;
  fromDate: any = "" ;
  toDate: any = "" ;
  formattedFromDate: any = "";
  formattedToDate: any = "";
  fuelLists;
  defaultBindingsList = [
    { value: 1, label: 'Vilnius' },
    { value: 2, label: 'Kaunas' },
    { value: 3, label: 'Pavilnys'}
];



  constructor(private apiService: ApiService, private router: Router,private parserFormatter: NgbDateParserFormatter,
    private datePipe: DatePipe) {
      this.formattedToDate = this.datePipe.transform(new Date(),  'dd-MM-yyyy');
      this.formattedFromDate = moment(this.datePipe.transform(new Date(), 'yyyy-MM-dd').toString()).subtract(2 , 'days').format('DD-MM-YYYY');
  }

  

  ngOnInit() {
    this.fuelEntries();
  }

  fuelEntries() {
    this.apiService.getData("fuelEntries").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.fuelLists = result.Items;
      },
    });
  }
  showTopValues(){
    
   const data ={
     fromDate : this.fromDate,
     toDate : this.toDate
   };
   console.log(this.formattedToDate);
  return;
  }
  
  deleteFuelEntry(assetId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable("#datatable-default")) {
      $("#datatable-default").DataTable().clear().destroy();
    }
    /******************************/

    this.apiService
      .deleteData("fuelEntries/" + assetId)
      .subscribe((result: any) => {
        this.fuelEntries();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}
