import { Component, OnInit } from "@angular/core";
import { animate, style, transition, trigger } from '@angular/animations';
import {ApiService} from '../../../api.service';
import { Router } from "@angular/router";
import { timer } from "rxjs";
import { MapBoxService } from "../../../map-box.service";
import { IDropdownSettings } from 'ng-multiselect-dropdown';


declare var $: any;

@Component({
  selector: "app-driver-list",
  templateUrl: "./driver-list.component.html",
  styleUrls: ["./driver-list.component.css"],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('400ms', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('400ms', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ],
})
export class DriverListComponent implements OnInit {
  title = "Driver List";
  visible = true;
  users = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings;
  defaultBindingsList = [
    { value: 1, label: 'Vilnius' },
    { value: 2, label: 'Kaunas' },
    { value: 3, label: 'Pavilnys', disabled: true }
];
 selectedCity = null;
   constructor(private apiService: ApiService, private router: Router,private mapBoxService: MapBoxService,
    ) {}

  ngOnInit() {
    this.fetchUsers();
    this.selectedCity = this.defaultBindingsList[0];
    this.mapBoxService.initMapbox(-104.618896, 50.44521);
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  valuechange() {
    this.visible = !this.visible;
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  fetchUsers() {
    this.apiService.getData("users/userType/driver").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.users = result.Items;
      },
    });
  }

  deleteUser(userName) {
     /******** Clear DataTable ************/
     if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
      }
      /******************************/

    this.apiService.deleteData("users/" + userName).subscribe((result: any) => {
      this.fetchUsers();
    });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      // $("#datatable-default").DataTable();
    });
  }
  showMap(){
    // $(document).ready(function(){
      $("#map_view").show();
   $("#list_view").hide();
   $("#map_view_btn").removeClass("btn-default").addClass("btn-success");
   $("#list_view_btn").removeClass("btn-success").addClass("btn-default");   
    // });
  }
  showList(){ 
    // $(document).ready(function(){
      $("#list_view").show();
      $("#map_view").hide();
      $("#list_view_btn").removeClass("btn-default").addClass("btn-success");
      $("#map_view_btn").removeClass("btn-success").addClass("btn-default");
  //  });
  }

  checkBoxesLength(){
    $(document).ready(function() {
     
      // $('.driver_checkbox:checked').each(function () {
      //   var sThisVal = (this.checked ? $(this).val() : "");
      //   alert(sThisVal);
      // });
     var c1 = $('.driver_checkbox:checked').length;
     if(c1==1){
              var sThisVal = $('.driver_checkbox:checked').val();
              alert(sThisVal);
     }
     else{
       alert("Select One Option for Editing");
     }
    });
  }
}
