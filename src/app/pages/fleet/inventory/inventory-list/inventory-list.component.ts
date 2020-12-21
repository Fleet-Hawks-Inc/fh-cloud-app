import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
declare var $: any;
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  items = [];
  itemGroups = {};
  vendors = {};
  warehouses = [];

  partNumber = '';
  partDetails = '';
  quantity = '';
  date = '';
  warehouseID1 :any = '';
  warehouseID2 :any = '';

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';
  partNo = [1,2,3,4,5,6,7,8,9,10];

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) {}

  ngOnInit() {
    this.fetchItems();
    this.fetchVendors();
    this.fetchItemGroups();
    this.fetchWarehouses();
    this.initDataTable();
  }


  fetchVendors(){
    this.apiService.getData(`vendors/get/list`).subscribe((result) => {
      this.vendors = result;
    })
  }

  fetchItemGroups(){
    this.apiService.getData(`itemGroups/get/list`).subscribe((result) => {
      this.itemGroups = result;
    })
  }


  openTransferModal(){
    $('#transferModal').modal('show');
  }

  fetchItems(){
    this.apiService.getData('items').subscribe((result) => {
      // this.items = result.Items;
      this.totalRecords = result.Count;
    })
  }

  fetchWarehouses(){
    this.apiService.getData('warehouses/get/list').subscribe((result: any) => {
      this.warehouses = result;
    });
  }

  deleteItem(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`items/isDeleted/${entryID}/`+1)
      .subscribe((result: any) => {
        this.rerender();
        this.toastr.success('Inventory Item Deleted Successfully!');
      });
    }
  }

  initDataTable() {
    let current = this;
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        { "targets": [0, 1, 2, 3, 4, 5, 6, 7, 8], "orderable": false },
      ],
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('items/fetch-records?lastKey=' + this.lastEvaluatedKey, dataTablesParameters).subscribe(resp => {
          //record number
          if(dataTablesParameters.start >=2) {
            current.partNo = [];
            let val = parseInt(dataTablesParameters.start+'0');
            let start = dataTablesParameters.start-1;
            start = parseInt(start+'1')
            for (let index = start; index <= val; index++) {
              current.partNo.push(index);
            }
          } else {
            current.partNo = [1,2,3,4,5,6,7,8,9,10]
          }
          current.items = resp['Items'];
          if (resp['LastEvaluatedKey'] !== undefined) {
            this.lastEvaluatedKey = resp['LastEvaluatedKey'].itemID;

          } else {
            this.lastEvaluatedKey = '';
          }

          callback({
            recordsTotal: current.totalRecords,
            recordsFiltered: current.totalRecords,
            data: []
          });
        });
      }
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(status = ''): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      if (status === 'reset') {
        this.dtOptions.pageLength = this.totalRecords;
      } else {
        this.dtOptions.pageLength = 10;
      }
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
