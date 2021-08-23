import {  Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCalendar, NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { Location } from '@angular/common';
import { DomSanitizer} from '@angular/platform-browser';
import { ListService } from '../../../../services/list.service';
import * as moment from 'moment';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
@Component({
  selector: 'app-add-assets',
  templateUrl: './add-assets.component.html',
  styleUrls: ['./add-assets.component.css'],
})
export class AddAssetsComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  allAssetTypes: any;
  public assetID;
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  pageTitle: string;
  errors = {};
  form;
  quantumSelected = '';
  assetsData = {
    inspectionFormID:'',
    assetIdentification: '',
    groupID: null,
    VIN: '',
    startDate:  moment().format('YYYY-MM-DD'),
    assetType: null,
    currentStatus: null,
    createdDate: '',
    createdTime: '',
    assetDetails: {
      year: null,
      manufacturer: null,
      model: null,
      length: 0,
      lengthUnit: null,
      height: '',
      heightUnit: null,
      axle: '',
      GVWR: '',
      GVWR_Unit: null,
      GAWR: '',
      GAWR_Unit: null,
      ownerShip: null,
      ownerOperator: null,
      licenceCountryCode: null,
      licenceStateCode: null,
      licencePlateNumber: '',
      annualSafetyDate: '',
      annualSafetyReminder: true,
      remarks: '',
    },
    insuranceDetails: {
      dateOfIssue: null,
      premiumAmount: '',
      premiumCurrency: null,
      dateOfExpiry: null,
      reminderBefore: '',
      reminderBeforeUnit: '',
      vendor: null
    },
    crossBorderDetails: {
      ACI_ID: '',
      ACE_ID: ''
    },
    uploadedPhotos: [],
    uploadedDocs: []
  };

  allAssets = [];
  groupData = {
    groupName: '',
    groupType : 'assets',
    description: '',
    groupMembers: []
  };

  vendors: any = [];
  manufacturers: any = [];
  models: any = [];
  groups = [];



  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  imageError = '';
  fileName = '';
  carrierID: any;
  states = [];
  uploadedPhotos = [];
  uploadedDocs = [];
  existingPhotos = [];
  existingDocs = [];
  assetsImages = []
  assetsDocs = [];
  inspectionForms = [];
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');

  years = [];
  ownOperators: any = [];
  submitDisabled = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };

  constructor(private apiService: ApiService, private route: ActivatedRoute,
              private router: Router, private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>,
              private location: Location,
              private toastr: ToastrService, private listService: ListService, private spinner: NgxSpinnerService, private domSanitizer: DomSanitizer) {
      this.selectedFileNames = new Map<any, any>();
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  ngOnInit() {
    this.getYears();
    this.listService.fetchAssetManufacturers();
    this.listService.fetchAssetModels();
    this.listService.fetchVendors();
    this.listService.fetchOwnerOperators();
    this.fetchGroups();
    this.fetchAssets();
    this.fetchInspectionForms();
    this.assetID = this.route.snapshot.params[`assetID`];
    if (this.assetID) {
      this.pageTitle = 'Edit Asset';
      this.fetchAssetByID();
    } else {
      this.pageTitle = 'Add Asset';
    }
    $(document).ready(() => {
      // this.form = $('#form_').validate();
    });

    this.vendors = this.listService.vendorList;
    this.manufacturers = this.listService.assetManufacturesList;
    this.models = this.listService.assetModelsList;
    this.ownOperators = this.listService.ownerOperatorList;
  }
  getYears() {
    var max = new Date().getFullYear(),
    min = max - 30,
    max = max;

    for(var i=max; i>=min; i--){
     this.years.push(i);
    }
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  resetModel(){
    this.assetsData.assetDetails.model = '';
    $('#assetSelect').val('');
  }

  async getInspectionForms(){
    await this.fetchInspectionForms();
  }
  fetchInspectionForms() {
    this.apiService
      .getData('inspectionForms/type/asset')
      .subscribe((result: any) => {
        this.inspectionForms = result.Items;
      });
  }

  getManufactures(){
    this.listService.fetchAssetManufacturers();
  }

  getModels(){
    this.listService.fetchAssetModels();
  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);
        
    localStorage.setItem('isOpen', 'true');
    this.listService.changeButton(false);
  }
  refreshVendorData() {
    this.listService.fetchVendors();
  }

  /*
   * Add new asset
   */
  addAsset() {
    this.hideErrors();
    this.submitDisabled = true;
    const data = {
      assetID: this.assetID,
      assetIdentification: this.assetsData.assetIdentification,
      groupID: this.assetsData.groupID,
      VIN: this.assetsData.VIN,
      startDate: this.assetsData.startDate,
      inspectionFormID: this.assetsData.inspectionFormID,
      assetType: this.assetsData.assetType,
      currentStatus: this.assetsData.currentStatus,
      assetDetails: {
        year: this.assetsData.assetDetails.year,
        manufacturer: this.assetsData.assetDetails.manufacturer ? this.assetsData.assetDetails.manufacturer : '',
        model: this.assetsData.assetDetails.model ? this.assetsData.assetDetails.model : '',
        length: this.assetsData.assetDetails.length,
        lengthUnit: this.assetsData.assetDetails.lengthUnit,
        height: this.assetsData.assetDetails.height,
        heightUnit: this.assetsData.assetDetails.heightUnit,
        axle: this.assetsData.assetDetails.axle,
        GVWR: this.assetsData.assetDetails.GVWR,
        GVWR_Unit: this.assetsData.assetDetails.GVWR_Unit,
        GAWR: this.assetsData.assetDetails.GAWR,
        GAWR_Unit: this.assetsData.assetDetails.GAWR_Unit,
        ownerShip: this.assetsData.assetDetails.ownerShip,
        ownerOperator: this.assetsData.assetDetails.ownerOperator,
        licenceCountryCode: this.assetsData.assetDetails.licenceCountryCode,
        licenceStateCode: this.assetsData.assetDetails.licenceStateCode,
        licencePlateNumber: this.assetsData.assetDetails.licencePlateNumber,
        annualSafetyDate: this.assetsData.assetDetails.annualSafetyDate,
        annualSafetyReminder: this.assetsData.assetDetails.annualSafetyReminder,
        remarks: this.assetsData.assetDetails.remarks
      },
      insuranceDetails: {
        dateOfIssue: this.assetsData.insuranceDetails.dateOfIssue,
        premiumAmount: this.assetsData.insuranceDetails.premiumAmount,
        premiumCurrency: this.assetsData.insuranceDetails.premiumCurrency,
        dateOfExpiry: this.assetsData.insuranceDetails.dateOfExpiry,
        reminderBefore: this.assetsData.insuranceDetails.reminderBefore,
        reminderBeforeUnit: this.assetsData.insuranceDetails.reminderBeforeUnit,
        vendor: this.assetsData.insuranceDetails.vendor
      },
      crossBorderDetails:{
        ACE_ID: this.assetsData.crossBorderDetails.ACE_ID,
        ACI_ID: this.assetsData.crossBorderDetails.ACI_ID
      },
      uploadedPhotos: this.uploadedPhotos,
      uploadedDocs: this.uploadedDocs
    };
    // create form data instance
    const formData = new FormData();

    // append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    // append docs if any
    for(let j = 0; j < this.uploadedDocs.length; j++){
      formData.append('uploadedDocs', this.uploadedDocs[j]);
    }

    // append other fields
    formData.append('data', JSON.stringify(data));

    this.apiService.postData('assets', formData, true).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              // val.message = val.message.replace(/".*"/, 'This Field');
               this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.submitDisabled = false;
              this.throwErrors();
            },
            error: () => {
              this.submitDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toastr.success('Asset added successfully.');
        this.cancel();
      },
    });
  }

  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        if(v === 'assetIdentification' || v === 'VIN') {
          $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
        }
      });
  }

  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label')
      });
    this.errors = {};
  }

  /*
   * Fetch Asset details before updating
  */
  fetchAssetByID() {
    this.spinner.show(); // loader init
    this.apiService
      .getData('assets/' + this.assetID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.assetsData[`assetID`] = this.assetID;
        this.assetsData.assetIdentification = result.assetIdentification;
        this.assetsData.createdTime = result.createdTime;
        this.assetsData.createdDate = result.createdDate;
        this.assetsData.groupID = result.groupID;
        this.assetsData.inspectionFormID = result.inspectionFormID;
        this.assetsData.VIN = result.VIN;
        this.assetsData.startDate = result.startDate;
        this.assetsData.assetType = result.assetType;
        this.assetsData.assetDetails.year = result.assetDetails.year;
        this.assetsData.assetDetails.manufacturer = result.assetDetails.manufacturer;
        this.assetsData.assetDetails.model = result.assetDetails.model;
        this.assetsData.assetDetails.length = result.assetDetails.length;
        this.assetsData.assetDetails.lengthUnit = result.assetDetails.lengthUnit;
        this.assetsData.assetDetails.height = result.assetDetails.height,
        this.assetsData.assetDetails.heightUnit = result.assetDetails.heightUnit,
        this.assetsData.assetDetails.axle = result.assetDetails.axle;
        this.assetsData.assetDetails.GVWR = result.assetDetails.GVWR;
        this.assetsData.assetDetails.GVWR_Unit = result.assetDetails.GVWR_Unit;
        this.assetsData.assetDetails.GAWR = result.assetDetails.GAWR;
        this.assetsData.assetDetails.GAWR_Unit = result.assetDetails.GAWR_Unit;
        this.assetsData.assetDetails.ownerShip = result.assetDetails.ownerShip;
        if (result.assetDetails.ownerShip === 'ownerOperator') {
          this.assetsData.assetDetails.ownerOperator = result.assetDetails.ownerOperator;
        }
        this.assetsData.currentStatus = result.currentStatus;
        this.assetsData.assetDetails.licenceCountryCode = result.assetDetails.licenceCountryCode;
        this.getStates(result.assetDetails.licenceCountryCode);
        this.assetsData.assetDetails.licenceStateCode = result.assetDetails.licenceStateCode;
        this.assetsData.assetDetails.licencePlateNumber = result.assetDetails.licencePlateNumber;
        this.assetsData.assetDetails.annualSafetyDate = result.assetDetails.annualSafetyDate;
        this.assetsData.assetDetails.annualSafetyReminder = result.assetDetails.annualSafetyReminder;
        this.assetsData.assetDetails.remarks = result.assetDetails.remarks;
        this.assetsData.insuranceDetails.dateOfIssue = result.insuranceDetails.dateOfIssue;
        this.assetsData.insuranceDetails.premiumAmount = result.insuranceDetails.premiumAmount;
        this.assetsData.insuranceDetails.premiumCurrency = result.insuranceDetails.premiumCurrency;
        this.assetsData.insuranceDetails.dateOfExpiry = result.insuranceDetails.dateOfExpiry;
        this.assetsData.insuranceDetails.dateOfIssue = result.insuranceDetails.dateOfIssue;
        this.assetsData.insuranceDetails.reminderBefore = result.insuranceDetails.reminderBefore;
        this.assetsData.insuranceDetails.reminderBeforeUnit = result.insuranceDetails.reminderBeforeUnit;
        this.assetsData.insuranceDetails.vendor = result.insuranceDetails.vendor;
        this.assetsData.crossBorderDetails.ACE_ID = result.crossBorderDetails.ACE_ID;
        this.assetsData.crossBorderDetails.ACI_ID = result.crossBorderDetails.ACI_ID;
        this.existingPhotos = result.uploadedPhotos;
        this.existingDocs = result.uploadedDocs;

        if(result.uploadedPhotos !== undefined && result.uploadedPhotos.length > 0) {
          this.assetsImages = result.uploadedPhotos.map((x: any) => ({
            path: `${this.Asseturl}/${result.carrierID}/${x}`,
            name: x,
          }));
        }

        if(result.uploadedDocs !== undefined && result.uploadedDocs.length > 0) {
          this.assetsDocs = result.uploadedDocs.map(x => ({path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x}));
        }

        this.spinner.hide(); // loader hide
      });

  }
  /*
   * Update asset
  */
  updateAsset() {
    this.hasError = false;
    this.hasSuccess = false;

    this.submitDisabled = true;
    const data = {
      assetID: this.assetID,
      assetIdentification: this.assetsData.assetIdentification,
      groupID: this.assetsData.groupID,
      VIN: this.assetsData.VIN,
      startDate: this.assetsData.startDate,
      createdTime: this.assetsData.createdTime,
      createdDate: this.assetsData.createdDate,
      inspectionFormID: this.assetsData.inspectionFormID,
      assetType: this.assetsData.assetType,
      currentStatus: this.assetsData.currentStatus,
      assetDetails: {
        year: this.assetsData.assetDetails.year,
        manufacturer: this.assetsData.assetDetails.manufacturer,
        model: this.assetsData.assetDetails.model,
        length: this.assetsData.assetDetails.length,
        lengthUnit: this.assetsData.assetDetails.lengthUnit,
        height: this.assetsData.assetDetails.height,
        heightUnit: this.assetsData.assetDetails.heightUnit,
        axle: this.assetsData.assetDetails.axle,
        GVWR: this.assetsData.assetDetails.GVWR,
        GVWR_Unit: this.assetsData.assetDetails.GVWR_Unit,
        GAWR: this.assetsData.assetDetails.GAWR,
        GAWR_Unit: this.assetsData.assetDetails.GAWR_Unit,
        ownerShip: this.assetsData.assetDetails.ownerShip,
        ownerOperator: this.assetsData.assetDetails.ownerOperator,
        licenceCountryCode: this.assetsData.assetDetails.licenceCountryCode,
        licenceStateCode: this.assetsData.assetDetails.licenceStateCode,
        licencePlateNumber: this.assetsData.assetDetails.licencePlateNumber,
        annualSafetyDate: this.assetsData.assetDetails.annualSafetyDate,
        annualSafetyReminder: this.assetsData.assetDetails.annualSafetyReminder,
        remarks: this.assetsData.assetDetails.remarks
      },
      insuranceDetails: {
        dateOfIssue: this.assetsData.insuranceDetails.dateOfIssue,
        premiumAmount: this.assetsData.insuranceDetails.premiumAmount,
        premiumCurrency: this.assetsData.insuranceDetails.premiumCurrency,
        dateOfExpiry: this.assetsData.insuranceDetails.dateOfExpiry,
        reminderBefore: this.assetsData.insuranceDetails.reminderBefore,
        reminderBeforeUnit: this.assetsData.insuranceDetails.reminderBeforeUnit,
        vendor: this.assetsData.insuranceDetails.vendor
      },
      crossBorderDetails: {
        ACE_ID: this.assetsData.crossBorderDetails.ACE_ID,
        ACI_ID: this.assetsData.crossBorderDetails.ACI_ID
      },
      uploadedPhotos: this.existingPhotos,
      uploadedDocs: this.existingDocs
    };
    // create form data instance
    const formData = new FormData();

    //append photos if any
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append docs if any
    for (let j = 0; j < this.uploadedDocs.length; j++) {
      formData.append('uploadedDocs', this.uploadedDocs[j]);
    }

    //append other fields
    formData.append('data', JSON.stringify(data));

    this.apiService.putData('assets/', formData, true).subscribe({
    // this.apiService.putData('assets', this.assetsData).subscribe({
      complete: () => { },
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.submitDisabled = false;
              this.throwErrors();
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => { },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.hasSuccess = true;
        this.toastr.success('Asset updated successfully.');
        this.cancel();
        this.Success = '';
      },
    });
  }


  selectDocuments(event, obj) {
    let files = [...event.target.files];

    if (obj === 'uploadedDocs') {
      this.uploadedDocs = [];
      for (let i = 0; i < files.length; i++) {
        this.uploadedDocs.push(files[i])
      }
    } else {
      this.uploadedPhotos = [];
      for (let i = 0; i < files.length; i++) {
          this.uploadedPhotos.push(files[i])
      }
    }
  }



  // Changing gvwr/gawr values
  gwr(value, el) {
    if (el === 'GVWR_Unit') {
      this.assetsData.assetDetails[`GAWR_Unit`] = value;
    } else {
      this.assetsData.assetDetails[`GVWR_Unit`] = value;
    }
  }

  fetchGroups() {
    this.apiService.getData(`groups/getGroup/${this.groupData.groupType}`).subscribe((result: any) => {
      this.groups = result.Items;
    });
  }

  getGroups(){
    this.fetchGroups();
  }


  fetchAssets() {
    this.apiService.getData('assets')
      .subscribe((result: any) => {
        this.allAssets = result.Items;
      });
  }

  addGroup() {
    this.apiService.postData('groups', this.groupData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              // this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.fetchGroups();
        this.toastr.success('Group added successfully.');
        $('#addGroupModal').modal('hide');
        this.groupData[`groupName`] = '';
        this.groupData[`groupMembers`] = [];
        this.groupData[`description`] = '';
      },
    });
  }

  getStates(countryCode) {
    this.assetsData.assetDetails.licenceStateCode = '';
    this.states = CountryStateCity.GetStatesByCountryCode([countryCode]);
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length-1];
    this.pdfSrc = '';
    if(ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

// delete uploaded images and documents
delete(type: string, name: string, index: any) {
  if (type === 'doc') {
    this.assetsDocs.splice(index, 1);
    this.existingDocs.splice(index, 1);
    this.deleteUploadedFile(type, name);
  } else {
    this.assetsImages.splice(index, 1);
    this.existingPhotos.splice(index, 1);
    this.deleteUploadedFile(type, name);
  }
}
deleteUploadedFile(type: string, name: string) { // delete from aws
  this.apiService.deleteData(`assets/uploadDelete/${this.assetID}/${type}/${name}`).subscribe((result: any) => { });
}

clearAssetGroup() {
  this.groupData = {
    groupName: '',
    groupType : 'assets',
    description: '',
    groupMembers: []
  };
}
}
