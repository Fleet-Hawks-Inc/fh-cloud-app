import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
@Component({
  selector: 'app-aci-details',
  templateUrl: './aci-details.component.html',
  styleUrls: ['./aci-details.component.css']
})
export class AciDetailsComponent implements OnInit {

  public entryID;
  title = 'ACI e-Manifest Details';
  data: string;
  sendId: string;
  companyKey: string;
  operation: string;
  portOfEntry: string;
  subLocation: string;
  estimatedArrivalDateTime: string;
  estimatedArrivalTimeZone: string;
  truck:any = {
    number: '',
    licensePlate:{
      number: '',
      stateProvince: ''},
      sealNumbers: []
};
  drivers = [];
  shipmentType: string;
  tripNumber: string;
  CCC: string;
  trailers: any = [];
  shipments: any = [];
  shipmentArray: any = [];
  containers: any = [];
  passengers: any = [];
  currentStatus: string;
  timeCreated: any;
  timeModified: any;
  createdBy = '';
  modifiedBy = '';
  responses = [];
  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  
  constructor(private apiService: ApiService, private route: ActivatedRoute,private toastr: ToastrService) { }

  ngOnInit() {
    this.entryID = this.route.snapshot.params['entryID'];
    this.fetchACEEntry();
  }  
  fetchACEEntry() {
    this.apiService
      .getData('ACIeManifest/details/' + this.entryID)
      .subscribe((result: any) => {
        this.entryID = this.entryID;
        this.data = result.data;
        this.sendId = result.sendId;
        this.companyKey = result.companyKey;
        this.operation = result.operation;
        this.tripNumber = result.tripNumber;
        this.CCC = result.CCC;
        this.portOfEntry = result.portOfEntry;
        this.subLocation = result.subLocation;
        this.estimatedArrivalDateTime = result.estimatedArrivalDateTime;
        this.estimatedArrivalTimeZone = result.estimatedArrivalTimeZone,
        this.truck = result.truck;
        this.drivers = result.drivers;
        this.passengers = result.passengers;
        this.trailers = result.trailers;
        this.containers = result.containers,
        this.shipments = result.shipments;
        this.currentStatus = result.currentStatus;     
        this.timeCreated = moment(result.timeCreated).format("MMMM D YYYY, h:mm:ss a");
        this.timeModified = moment(result.timeModified).format("MMMM D YYYY, h:mm:ss a");
        this.createdBy = result.createdBy; 
        this.modifiedBy = result.modifiedBy; 
        this.responses = result.responses;
      });
  }
 
  setStatus(entryID, val) {
    this.apiService.getData('ACIeManifest/setStatus/' + entryID + '/' + val).subscribe((result: any) => {
      this.toastr.success('Status Updated Successfully!');
      this.currentStatus = val;
    });
  }
  sendCBSAFn(){
    this.apiService
    .getData('ACIeManifest/CBSAdetails/' + this.entryID)
    .subscribe((result: any) => { 
    });
 
  }
}
