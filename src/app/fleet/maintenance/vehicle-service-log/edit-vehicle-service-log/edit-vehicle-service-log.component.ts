import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../../api.service";
import { from, of } from "rxjs";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import {AwsUploadService} from '../../../../aws-upload.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-edit-vehicle-service-log",
  templateUrl: "./edit-vehicle-service-log.component.html",
  styleUrls: ["./edit-vehicle-service-log.component.css"],
})
export class EditVehicleServiceLogComponent implements OnInit, AfterViewInit {
  title = "Edit Vehicle Service Log";

  errors = {};
  form;


  imageError = '';
  fileName = '';

  /********** Form Fields ***********/

  logID = "";
  vehicleID = "";
  vendorID = "";
  taskDescription = "";
  serviceType = "";
  value = "";
  odometer = "";
  attachStockItem = "";
  timeCreated = "";

  /******************/

  quantity = "";
  itemID = "";
  selectedItems = [];
  items = [];
  vehicles = [];
  vendors = [];
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute,
              private apiService: ApiService,
              private awsUS: AwsUploadService) {}

  ngOnInit() {
    this.logID = this.route.snapshot.params["logID"];
    this.fetchVehicles();
    this.fetchItems();
    this.fetchVendors();
    this.fetchVehicleServiceLog();
  }

  fetchVehicleServiceLog() {
    this.apiService
      .getData("vehicleServiceLogs/" + this.logID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.vehicleID = result.vehicleID;
        this.vendorID = result.vendorID;
        this.serviceType = result.serviceType;
        this.taskDescription = result.taskDescription;
        this.value = result.value;
        this.odometer = result.odometer;
        this.selectedItems = result.attachStockItem;
        this.timeCreated = result.timeCreated;
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
    let item = this.selectedItems.filter(
      (selectedItem) => selectedItem.itemID == this.itemID
    );
    if (item.length > 0) {
      alert(
        "Its already added or you can delete the existing item to change quantity."
      );
      return false;
    }

    this.selectedItems.push({
      itemID: this.itemID,
      quantity: this.quantity,
    });
  }

  removeItem(index) {
    this.selectedItems.splice(index);
  }

  getItemName(itemID) {
    let item = this.items.filter((item) => item.itemID == itemID);
    return item[0].itemName;
  }

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  updateVehicleServiceLog() {

    if (this.fileName === '') {
      this.imageError = 'Please Choose Image To Upload';
      return;
    }

    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      logID: this.logID,
      vehicleID: this.vehicleID,
      vendorID: this.vendorID,
      taskDescription: this.taskDescription,
      serviceType: this.serviceType,
      value: this.value,
      odometer: this.odometer,
      attachStockItem: this.selectedItems,
      timeCreated: this.timeCreated,
    };

    this.apiService.putData("vehicleServiceLogs", data).subscribe({
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
        this.Success = "Vehicle Service log updated successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
    }

  uploadFile(event) {
    this.imageError = '';
    if (this.awsUS.imageFormat(event.target.files.item(0)) !== -1) {
      this.fileName = this.awsUS.uploadFile('test', event.target.files.item(0));
    } else {
      this.fileName = '';
      this.imageError = 'Invalid Image Format';
    }
  }
}
