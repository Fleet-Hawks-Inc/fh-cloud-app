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
  usPortOfArrival: string;
  estimatedArrivalDateTime: string;
  tripNumber: string;
  currentStatus: string;
  truck: any = {
    number: '',
    type: '',
    vinNumber: '',
    dotNumber: '',
    insurancePolicy: {
      insuranceCompanyName: '',
      policyNumber: '',
      issuedDate: '',
      policyAmount: '',
    },
    licensePlates: [
      {
        number: '',
        stateProvince: ''
      }
    ],
    sealNumbers: []    
  };
  drivers = [];
  trailers = [];
  shipments = [];
  passengers = [];
  result: any;
  timeModified: any;
  modifiedBy: any;
  createdBy: any;
  borderResponses = [];
  shipmentData = {
    shipmentControlNumber: '',
    type: '',
    shipperName: '',
    consigneeName: '',
    provinceOfLoading: '',
    commodities: [],
    thirdParties: [],
  };
  driverData = {
    driverID: '',
    driverNumber: '',
    firstName: '',
    gender: '',
    lastName: '',
    dateOfBirth: '',
    citizenshipCountry: '',
    fastCardNumber:'',
    travelDocuments: [],
  };
  passengerData = {
    passengerID: '',
    firstName: '',
    gender: '',
    lastName: '',
    dateOfBirth: '',
    citizenshipCountry: '',
    fastCardNumber:'',
    travelDocuments: [],
  };
  constructor(private apiService: ApiService, private route: ActivatedRoute, private toastr: ToastrService) { }

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
        this.borderResponses = result.borderResponses;
        this.createdBy = result.createdBy;
      });
  }

  setStatus(entryID, val) {
    this.apiService.getData('ACEeManifest/setStatus/' + entryID + '/' + val).subscribe((result: any) => {
      this.toastr.success('Status Updated Successfully!');
      this.currentStatus = val;
    });
  }
  sendCBPFn() {
    this.apiService
      .getData('ACEeManifest/CBPdetails/' + this.entryID)
      .subscribe((result: any) => {
      });

  }
  showShipmentDetails(shipmentID) {

    let shipmentData = this.shipments.filter((item: any) => item.shipmentID === shipmentID);
    this.shipmentData = {
      shipmentControlNumber: shipmentData[0].shipmentControlNumber,
      type: shipmentData[0].type,
      provinceOfLoading: shipmentData[0].provinceOfLoading,
      shipperName: shipmentData[0].shipper.name,
      consigneeName: shipmentData[0].consignee.name,
      commodities: shipmentData[0].commodities,
      thirdParties: shipmentData[0].thirdParties
    }
  }
  showDriverDetails(driverID) {
    let driverData: any = this.drivers.filter((item: any) => item.driverID === driverID);
    this.driverData = {
      driverID: driverData[0].driverID,
      driverNumber: driverData[0].driverNumber,
      firstName: driverData[0].firstName,
      gender: driverData[0].gender,
      lastName: driverData[0].lastName,
      dateOfBirth: driverData[0].dateOfBirth,
      citizenshipCountry: driverData[0].citizenshipCountry,
      fastCardNumber: driverData[0].fastCardNumber,
      travelDocuments: driverData[0].travelDocuments
    }
  }
  showPassengerDetails(passengerID) {
    let passengerData: any = this.passengers.filter((item: any) => item.passengerID === passengerID);
    this.passengerData = {
      passengerID: passengerData[0].passengerID,
      firstName: passengerData[0].firstName,
      gender: passengerData[0].gender,
      lastName: passengerData[0].lastName,
      dateOfBirth: passengerData[0].dateOfBirth,
      citizenshipCountry: passengerData[0].citizenshipCountry,
      fastCardNumber: passengerData[0].fastCardNumber,
      travelDocuments: passengerData[0].travelDocuments
    }
  }
}
