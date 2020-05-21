import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../../api.service";
import { catchError, map, mapTo, tap, retry } from "rxjs/operators";
import { from, of } from "rxjs";
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-add-stock-assignment",
  templateUrl: "./add-stock-assignment.component.html",
  styleUrls: ["./add-stock-assignment.component.css"],
})
export class AddStockAssignmentComponent implements OnInit {
  title = "Add Stock Assignment";

  errors = {};
  form;

  /********** Form Fields ***********/

  vehicleID = "";
  itemID = "";
  quantity = "";
  totalQuantity: any = 0;
  selectedItems = [];

  items = [];
  vehicles = [];
  /******************/

  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.fetchVehicles();
    this.fetchItems();
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

  addItem() {
    //check item already exists in selection
    let item = this.selectedItems.filter(
      (selectedItem) => selectedItem.itemID == this.itemID
    );
    if (item.length > 0) {
      alert(
        "Its already added in Assignment or you can delete the existing item to add new."
      );
      return false;
    }
    if(this.itemID && this.quantity){
      this.selectedItems.push({
        itemID: this.itemID,
        quantity: this.quantity,
      });
    }

    //update total quantity
    this.totalQuantity += this.quantity;
  }

  removeItem(index) {
    this.selectedItems.splice(index);

    //update total quantity
    this.totalQuantity -= this.selectedItems[index].quantity;
    console.log(this.totalQuantity);
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

  addStockAssignment() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      vehicleID: this.vehicleID,
      items: this.selectedItems,
      totalQuantity: this.totalQuantity,
    };
   // console.log(data);return ;
    this.apiService.postData("stockAssignments", data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe((val) => {
            this.throwErrors();
          });
      },
      next: (res) => {
        this.vehicleID = "";
        this.quantity = "";
        this.hasSuccess = true;
        this.Success = "Stock Assignment Added successfully";

        this.selectedItems = [];
        this.totalQuantity = 0;
        this.itemID = '';
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
