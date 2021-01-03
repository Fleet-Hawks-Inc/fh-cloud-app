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

  hideShow = {
    part: true,
    name: true,
    category: true,
    vendor: true,
    quantity: true,
    onHand: true,
    unitCost: true,
    warehouse: true,
    warranty: false,
    reorderPoint: false,
    reorderQuantity: false,
    preferredVendor: false,
  }

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
        { "targets": [0,1,2,3,4,5,6,7,8,9,10,11], "orderable": false },
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

  hideShowColumn() {
    //for headers
    if(this.hideShow.part == false) {
      $('.col1').css('display','none');
    } else {
      $('.col1').css('display','');
    }

    if(this.hideShow.name == false) {
      $('.col2').css('display','none');
    } else {
      $('.col2').css('display','');
    }

    if(this.hideShow.category == false) {
      $('.col3').css('display','none');
    } else {
      $('.col3').css('display','');
    }

    if(this.hideShow.vendor == false) {
      $('.col4').css('display','none');
    } else {
      $('.col4').css('display','');
    }

    if(this.hideShow.quantity == false) {
      $('.col5').css('display','none');
    } else {
      $('.col5').css('display','');
    }

    if(this.hideShow.onHand == false) {
      $('.col6').css('display','none');
    } else {
      $('.col6').css('display','');
    }

    if(this.hideShow.unitCost == false) {
      $('.col7').css('display','none');
    } else {
      $('.col7').css('display','');
    }

    if(this.hideShow.warehouse == false) {
      $('.col8').css('display','none');
    } else {
      $('.col8').css('display','');
    }

    //extra columns
    if(this.hideShow.warranty == false) {
      $('.col9').css('display','none');
    } else { 
      $('.col9').removeClass('extra');
      $('.col9').css('display','');
    }

    if(this.hideShow.reorderPoint == false) {
      $('.col10').css('display','none');
    } else { 
      $('.col10').removeClass('extra');
      $('.col10').css('display','');
    }

    if(this.hideShow.reorderQuantity == false) {
      $('.col11').css('display','none');
    } else { 
      $('.col11').removeClass('extra');
      $('.col11').css('display','');
    }
    
    if(this.hideShow.preferredVendor == false) {
      $('.col12').css('display','none');
    } else { 
      $('.col12').removeClass('extra');
      $('.col12').css('display','');
    }
  }
}
