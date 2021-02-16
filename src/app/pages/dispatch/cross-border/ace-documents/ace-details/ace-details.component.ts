import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-ace-details',
  templateUrl: './ace-details.component.html',
  styleUrls: ['./ace-details.component.css']
})
export class AceDetailsComponent implements OnInit {
  public entryID;  
  drivers = []; 
  usPortOfArrival: string;
  estimatedArrivalDateTime: string;
  tripNumber: string;
  currentStatus: string;  
  truck: any = {};
  trailers = [];
  shipments = [];  
  passengers = [];
  result: any;
  timeModified: any;
  modifiedBy: any;
  responses: any;
  shipmentData = {
    shipmentControlNumber:'',
    type: '',
    shipperName: '',
    consigneeName: '',
    provinceOfLoading: '',
    commodities : [],
    thirdParties: [],
  };
  constructor(private apiService: ApiService, private route: ActivatedRoute,private toastr: ToastrService) { }

  ngOnInit() {
    this.entryID = this.route.snapshot.params['entryID'];
    this.fetchACEEntry();
  }  
  fetchACEEntry() {
    this.apiService
      .getData('ACEeManifest/details/' + this.entryID)
      .subscribe((result: any) => {
        this.estimatedArrivalDateTime = result.estimatedArrivalDateTime;
        this.usPortOfArrival = result.usPortOfArrival;
        this.tripNumber = result.tripNumber;
        this.currentStatus = result.currentStatus;
        this.truck = result.truck;
        this.trailers = result.trailers;
       this.drivers = result.drivers;
       this.passengers = result.passengers;
       this.shipments = result.shipments;
       this.timeModified = moment(result.timeModified).format("MMMM D YYYY, h:mm:ss a"); 
       this.modifiedBy = result.modifiedBy; 
       this.responses = result.responses; 
              
      });
  }

  setStatus(entryID, val) {
    this.apiService.getData('ACEeManifest/setStatus/' + entryID + '/' + val).subscribe((result: any) => {
      this.toastr.success('Status Updated Successfully!');
      this.currentStatus = val;
    });
  }
  sendCBPFn(){
    this.apiService
    .getData('ACEeManifest/CBPdetails/' + this.entryID)
    .subscribe((result: any) => { 
    });
 
  }
  showShipmentDetails(shipmentNumber){
    let shipmentData = this.shipments.filter((item:any) => item.shipmentControlNumber === shipmentNumber);  
    this.shipmentData = {
      shipmentControlNumber: shipmentData[0].shipmentControlNumber ,
      type: shipmentData[0].type ,
      provinceOfLoading: shipmentData[0].provinceOfLoading,
      shipperName: shipmentData[0].shipper.name,
      consigneeName: shipmentData[0].consignee.name,
      commodities: shipmentData[0].commodities,
      thirdParties: shipmentData[0].thirdParties
    }
  }
}
;