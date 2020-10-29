import {  Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import {  ActivatedRoute } from '@angular/router';
import {  map } from 'rxjs/operators';
import { from } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-edit-stock-assignment',
  templateUrl: './edit-stock-assignment.component.html',
  styleUrls: ['./edit-stock-assignment.component.css'],
})
export class EditStockAssignmentComponent implements OnInit {
  title = 'Edit Stock Assignment';

  errors = {};
  form;

  /********** Form Fields ***********/
  assignmentID = '';
  vehicleID = '';
  itemID = '';
  quantity = '';
  totalQuantity: any = 0;
  timeCreated = '';
  selectedItems = [];

  items = [];
  vehicles = [];
  /******************/

  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.assignmentID = this.route.snapshot.params['assignmentID'];

    this.fetchStockAssignment();
    this.fetchVehicles();
    this.fetchItems();

  }

  fetchStockAssignment(){
    this.apiService.getData('stockAssignments/' + this.assignmentID).subscribe((result: any) => {
      result = result.Items[0];
      this.assignmentID = result.assignmentID;
      this.selectedItems = result.items;
      this.vehicleID = result.vehicleID;
      this.totalQuantity = result.totalQuantity;
      this.timeCreated = result.timeCreated;

      console.log(this.selectedItems);

    });
  }

  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }

  fetchItems() {
    this.apiService.getData('items').subscribe((result: any) => {
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
        'Its already added in Assignment or you can delete the existing item to add new.'
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
    console.log(this.selectedItems)
    this.selectedItems.splice(0, index);

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
      this.form = $('#form_').validate();
    });
  }

  updateStockAssignment() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      assignmentID: this.assignmentID,
      vehicleID: this.vehicleID,
      items: this.selectedItems,
      totalQuantity: this.totalQuantity,
      timeCreated: this.timeCreated
    };
   // console.log(data);return ;
    this.apiService.putData('stockAssignments', data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe((val) => {
            this.throwErrors();
          });
      },
      next: (res) => {
        this.hasSuccess = true;
        this.Success = 'Stock Assignment updated successfully';
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
