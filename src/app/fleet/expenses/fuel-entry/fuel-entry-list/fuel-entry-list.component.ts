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
 entryId = "";
 vehicles = [];
 countries = [];
  formattedFromDate: any = "";
  formattedToDate: any = "";
  fuelLists;
  defaultBindingsList = [
    { value: 1, label: 'Vilnius' },
    { value: 2, label: 'Kaunas' },
    { value: 3, label: 'Pavilnys'}
];



  constructor(
                private apiService: ApiService,
                private route: Router ,
                private parserFormatter: NgbDateParserFormatter,
                private datePipe: DatePipe) {
      this.formattedToDate = this.datePipe.transform(new Date(),  'dd-MM-yyyy');
      this.formattedFromDate = moment(this.datePipe.transform(new Date(), 'yyyy-MM-dd').toString()).subtract(2 , 'days').format('DD-MM-YYYY');
  }

  

  ngOnInit() {
    this.fuelEntries(); 
    this.fetchVehicles();   
    this.fetchCountries();

  }
   // For checking number of checked checkboxes
   checkBoxesLength()
   {        
     var c1 = $('.fuel_checkbox:checked').length;
     if(c1==1){
              this.entryId = $('.fuel_checkbox:checked').val();  
              this.route.navigateByUrl('/fleet/expenses/fuel/Edit-Fuel-Entry/'+this.entryId);
     }
     else{
       alert("Select One Option for Editing");
     } 
  }
  fetchVehicles() {
    this.apiService.getData("vehicles").subscribe((result: any) => {
      this.vehicles = result.Items;
    });
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
  getVehicleName(ID){
    var vehicleName :any = this.vehicles.filter(function (el) {
      return el.vehicleID  == ID; 
    });
    return vehicleName.vehicleName;
  }
  fetchCountries() {
    this.apiService.getData("countries").subscribe((result: any) => {
      this.countries = result.Items;
    });
  }
  // getCountryName(ID){
  //   var countryName  = this.countries.filter(function (el) {
  //     // console.log("this is", el);
  //     if(el.countryID  == ID){  
  //       console.log("country Name",el.countryName);  
  //       return el.countryName;
  //     }      
  //   });
    // console.log("hello",countryName);
    // console.log(countryName.countryName);
    // return countryName.countryName;    
  //}
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
