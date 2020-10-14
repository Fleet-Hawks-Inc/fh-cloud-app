import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { from, of } from "rxjs";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import {AwsUploadService} from '../../../../aws-upload.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-add-vehicle-service-log",
  templateUrl: "./add-vehicle-service-log.component.html",
  styleUrls: ["./add-vehicle-service-log.component.css"],
})
export class AddVehicleServiceLogComponent implements OnInit, AfterViewInit {
  title = "Add vehicle Service Log";

  imageError = '';
  fileName = '';

  errors = {};
  form;

  /********** Form Fields ***********/

  vehicleID = "";
  vendorID = "";
  taskDescription = "";
  serviceType = "";
  value = "";
  odometer = "";
  attachStockItem = "";

  /******************/
  quantity = "";
  itemID = "";
  selectedItems = [];
  items = [];
  vehicles = [];
  vendors = [];
  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService,
              private router: Router,
              private awsUS: AwsUploadService) {}

  ngOnInit() {
    this.fetchVehicles();
    this.fetchItems();
    this.fetchVendors();
  }

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  fetchVehicles() {
    this.apiService.getData("vehicles").subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }

  fetchItems() {
    this.apiService.getData("items").subscribe((result: any) => {
      this.items = result.Items;
    });
  }

  fetchVendors() {
    this.apiService.getData("vendors").subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }

  addItem() {
    //check item already exists in selection
    const item = this.selectedItems.filter(
      (selectedItem) => selectedItem.itemID === this.itemID
    );
    if (item.length > 0) {
      alert(
        "Its already added or you can delete the existing item to change quantity."
      );
      return false;
    }

    // console.log(this.itemID);
    // console.log(this.quantity);
    if(this.itemID && this.quantity){
      this.selectedItems.push({
        itemID: this.itemID,
        quantity: this.quantity,
      });
    } 
  }

  removeItem(index) {
    this.selectedItems.splice(index);
  }

  getItemName(itemID) {
    let item = this.items.filter((item) => item.itemID === itemID);
    return item[0].itemName;
  }


  uploadFile(event) {
    this.imageError = '';
    if (this.awsUS.imageFormat(event.target.files.item(0)) !== -1) {
      //this.fileName = this.awsUS.uploadFile('test', event.target.files.item(0));
     } else {
      this.fileName = '';
      this.imageError = 'Invalid Image Format';
    }
  }


  addVehicleServiceLog() {
    if (this.fileName === '') {
      this.imageError = 'Please Choose Image To Upload';
      return;
    }


    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      vehicleID: this.vehicleID,
      vendorID: this.vendorID,
      taskDescription: this.taskDescription,
      serviceType: this.serviceType,
      value: this.value,
      odometer: this.odometer,
      attachStockItem: this.selectedItems,
    };

    this.apiService.postData("vehicleServiceLogs", data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              console.log(key);
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Vehicle Service log added successfully";
        this.vehicleID = '';
        this.vendorID = '';
        this.taskDescription = '';
        this.value = '';
        this.odometer = '';
        this.serviceType = "";
        this.selectedItems = [];
        this.itemID = "";
        this.quantity = "";
      },
    });

  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

}
