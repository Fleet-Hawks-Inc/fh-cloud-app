import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../../../../services';
import { ActivatedRoute } from '@angular/router';
import { HereMapService } from "../../../../../services/here-map.service";

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  private logID;
  programs;
  logsData: any;
  allServiceTasks: any;
  allServiceParts: any;
  vehicle: any;
  assetID: any;
  completionDate: any;
  odometer: any;
  reference: any;
  vendorID: any;
  description: any;
  vehiclesObject: any = {};
  vendorsObject: any = {};
  issuesObject: any = {};
  assetsObject: any = {};

  taskSubTotal: number;
  taskDiscountAmount: number;
  taskDiscountPercent: number;
  taskTaxAmount: number;
  taskTaxPercent: number;
  taskTotal: number;
  
  partsSubTotal: number;
  partsQuantity: number;
  partsDiscountAmount: number;
  partsDiscountPercent: number;
  partsTaxAmount: number;
  partsTaxPercent: number;
  partsTotal: number;

  constructor(
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private route: ActivatedRoute,
      private hereMap: HereMapService
  ) { }

  ngOnInit() {
    this.logID = this.route.snapshot.params['logID'];
    this.fetchProgramByID();
    this.fetchAllVehiclesIDs();
    this.fetchAllVendorsIDs();
    this.fetchAllIssuesIDs();
    this.fetchAllAssetsIDs();
    this.hereMap.mapInit();
  }

  fetchProgramByID() {
    this.spinner.show(); // loader init
    this.apiService.getData(`serviceLogs/${this.logID}`).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.logsData = result.Items;
        result = result.Items[0];
        
        this.vehicle = result.vehicleID;
        this.assetID = result.assetID;
        this.vendorID = result.vendorID;
        this.completionDate = result.completionDate;
        this.odometer = result.odometer;
        this.reference = result.reference;
        this.description = result.description;
        this.allServiceTasks = result.allServiceTasks.serviceTaskList;
        this.allServiceParts = result.allServiceParts.servicePartsList;

        this.taskSubTotal = result.allServiceTasks.subTotal;
        this.taskDiscountAmount = result.allServiceTasks.discountAmount;
        this.taskDiscountPercent = result.allServiceTasks.discountPercent;
        this.taskTaxAmount = result.allServiceTasks.taxAmount;
        this.taskTaxPercent = result.allServiceTasks.taxPercent;
        this.taskTotal = result.allServiceTasks.total;

        this.partsSubTotal = result.allServiceParts.subTotal;
        this.partsQuantity = result.allServiceParts.totalQuantity;
        this.partsDiscountAmount = result.allServiceParts.discountAmount;
        this.partsDiscountPercent = result.allServiceParts.discountPercent;
        this.partsTaxAmount = result.allServiceParts.taxAmount;
        this.partsTaxPercent = result.allServiceParts.taxPercent;
        this.partsTotal = result.allServiceParts.total;
        this.spinner.hide(); // loader hide
      },
    });
  }

 fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/get/list')
      .subscribe((result: any) => {
        this.vehiclesObject = result;
      });
  }

  fetchAllVendorsIDs() {
    this.apiService.getData('vendors/get/list')
      .subscribe((result: any) => {
        this.vendorsObject = result;
      });
  }

  fetchAllIssuesIDs() {
    this.apiService.getData('issues/get/list')
      .subscribe((result: any) => {
        this.issuesObject = result;
      });
  }

  fetchAllAssetsIDs() {
    this.apiService.getData('assets/get/list')
      .subscribe((result: any) => {
        this.assetsObject = result;
      });
  }
}
