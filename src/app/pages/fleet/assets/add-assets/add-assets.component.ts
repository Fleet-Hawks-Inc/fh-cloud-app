import {  Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
import { v4 as uuidv4 } from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner'; 
import { NgbCalendar, NgbDateAdapter,  NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

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
    assetIdentification: '',
    groupID: '',
    VIN: '',
    assetDetails: {
      assetType: '',
      currentStatus: '',
      year: '',
      manufacturer: '',
      model: '',
      length: '',
      lengthUnit: '',
      axle: '',
      GVWR: '',
      GVWR_Unit: '',
      GAWR: '',
      GAWR_Unit: '',
      ownerShip: '',
      licenceCountryID: '',
      licenceStateID: '',
      licencePlateNumber: '',
      remarks: '',
    },
    insuranceDetails: {
      dateOfIssue: '',
      premiumAmount: '',
      premiumCurrency: '',
      dateOfExpiry: '',
      reminderBefore: '',
      reminderBeforeUnit: '',
      vendor: ''
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
    groupType : 'assets'
  };

  vendors = [];
  manufacturers = [];
  models = [];
  groups = [];

  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  imageError = '';
  fileName = '';
  carrierID: any;
  private states;
  private countries;

  uploadedPhotos = [];
  uploadedDocs = [];
  existingPhotos = [];
  existingDocs = [];
  assetsImages = []
  assetsDocs = [];
  pdfSrc:any = this.domSanitizer.bypassSecurityTrustResourceUrl('');

  years = [];

  constructor(private apiService: ApiService, private httpClient: HttpClient, private awsUS: AwsUploadService, private route: ActivatedRoute,
              private router: Router, private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>,
              private toastr: ToastrService, private spinner: NgxSpinnerService, private domSanitizer: DomSanitizer) {
      this.selectedFileNames = new Map<any, any>();
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  ngOnInit() {
    this.getYears();
    this.fetchManufactuer();
    this.fetchVendors();
    this.fetchCountries(); // fetch countries
    this.fetchAllAssetTypes();
    this.fetchGroups();
    this.fetchAssets();

    this.assetID = this.route.snapshot.params['assetID'];
    if (this.assetID) {
      this.pageTitle = 'Edit Asset';
      this.fetchAssetByID();
    } else {
      this.pageTitle = 'Add Asset';
    }
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  getYears() {
    var max = new Date().getFullYear(),
    min = max - 30,
    max = max;
    
    for(var i=max; i>=min; i--){
     this.years.push(i);
    }
  }
  
  /*
   * Get all assets types from trailers.json file
   */

  fetchAllAssetTypes() {
    this.httpClient.get("assets/trailers.json").subscribe(data =>{
      this.allAssetTypes = data;
    })
  }
  /*
   * Get all manufacturers from api
   */
  fetchManufactuer() {
    this.apiService.getData('manufacturers').subscribe((result: any) => {
      this.manufacturers = result.Items;
    });
  }
  /*
   * Get all vendors from api
   */
  fetchVendors() {
    this.apiService.getData('vendors').subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }
  /*
   * Get all models from api
   */
  getModels(id) {

    this.apiService
      .getData(`vehicleModels/manufacturer/${id}`)
      .subscribe((result: any) => {
        this.models = result.Items;
        this.spinner.hide(); // loader hide
      });
  }

  /*
   * Add new asset
   */
  addAsset() {
    
    this.hideErrors();

    const data = {
      assetID: this.assetID,
      assetIdentification: this.assetsData.assetIdentification,
      groupID: this.assetsData.groupID,
      VIN: this.assetsData.VIN,
      assetDetails:{
        assetType: this.assetsData.assetDetails.assetType,
        year: this.assetsData.assetDetails.year,
        manufacturer: this.assetsData.assetDetails.manufacturer,
        model: this.assetsData.assetDetails.model,
        length: this.assetsData.assetDetails.length,
        lengthUnit: this.assetsData.assetDetails.lengthUnit,
        axle: this.assetsData.assetDetails.axle,
        GVWR: this.assetsData.assetDetails.GVWR,
        GVWR_Unit: this.assetsData.assetDetails.GVWR_Unit,
        GAWR: this.assetsData.assetDetails.GAWR,
        GAWR_Unit: this.assetsData.assetDetails.GAWR_Unit,
        ownerShip: this.assetsData.assetDetails.ownerShip,
        currentStatus: this.assetsData.assetDetails.currentStatus,
        licenceCountryID: this.assetsData.assetDetails.licenceCountryID,
        licenceStateID: this.assetsData.assetDetails.licenceStateID,
        licencePlateNumber: this.assetsData.assetDetails.licencePlateNumber,
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

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append docs if any
    for(let j = 0; j < this.uploadedDocs.length; j++){
      formData.append('uploadedDocs', this.uploadedDocs[j]);
    }

    //append other fields
    formData.append('data', JSON.stringify(data));

    this.apiService.postData('assets', formData, true).subscribe({
      complete: () => { },
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
              this.Success = '';
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        //this.uploadFiles(); // upload selected files to bucket
        this.toastr.success('Asset added successfully.');
        this.router.navigateByUrl('/fleet/assets/list');
      },
    });
  }

  throwErrors() {
    
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
    // this.vehicleForm.showErrors(this.errors);
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
        console.log('result', result);
        this.assetsData['assetID'] = this.assetID;
        this.assetsData['assetIdentification'] = result.assetIdentification;
        this.assetsData['groupID'] = result.groupID;
        this.assetsData['VIN'] = result.VIN;
        this.assetsData['assetDetails']['assetType'] = result.assetDetails.assetType;
        this.assetsData['assetDetails']['year'] = result.assetDetails.year;
        this.assetsData['assetDetails']['manufacturer'] = result.assetDetails.manufacturer;
        this.getModels(result.assetDetails.manufacturer);
        this.assetsData['assetDetails']['model'] = result.assetDetails.model;
        this.assetsData['assetDetails']['length'] = result.assetDetails.length;
        this.assetsData['assetDetails']['lengthUnit'] = result.assetDetails.lengthUnit;
        this.assetsData['assetDetails']['axle'] = result.assetDetails.axle;
        this.assetsData['assetDetails']['GVWR'] = result.assetDetails.GVWR;
        this.assetsData['assetDetails']['GVWR_Unit'] = result.assetDetails.GVWR_Unit;
        this.assetsData['assetDetails']['GAWR'] = result.assetDetails.GAWR;
        this.assetsData['assetDetails']['GAWR_Unit'] = result.assetDetails.GAWR_Unit;
        this.assetsData['assetDetails']['ownerShip'] = result.assetDetails.ownerShip;
        this.assetsData['assetDetails']['currentStatus'] = result.assetDetails.currentStatus;
        this.assetsData['assetDetails']['licenceCountryID'] = result.assetDetails.licenceCountryID;
        this.getStates(result.assetDetails.licenceCountryID);
        this.assetsData['assetDetails']['licenceStateID'] = result.assetDetails.licenceStateID;
        this.assetsData['assetDetails']['licencePlateNumber'] = result.assetDetails.licencePlateNumber;
        this.assetsData['assetDetails']['remarks'] = result.assetDetails.remarks;
        this.assetsData['insuranceDetails']['dateOfIssue'] = result.insuranceDetails.dateOfIssue;
        this.assetsData['insuranceDetails']['premiumAmount'] = result.insuranceDetails.premiumAmount;
        this.assetsData['insuranceDetails']['premiumCurrency'] = result.insuranceDetails.premiumCurrency;
        this.assetsData['insuranceDetails']['dateOfExpiry'] = result.insuranceDetails.dateOfExpiry;
        this.assetsData['insuranceDetails']['dateOfIssue'] = result.insuranceDetails.dateOfIssue;
        this.assetsData['insuranceDetails']['reminderBefore'] = result.insuranceDetails.reminderBefore;
        this.assetsData['insuranceDetails']['reminderBeforeUnit'] = result.insuranceDetails.reminderBeforeUnit;
        this.assetsData['insuranceDetails']['vendor'] = result.insuranceDetails.vendor;
        this.assetsData['crossBorderDetails']['ACE_ID'] = result.crossBorderDetails.ACE_ID;
        this.assetsData['crossBorderDetails']['ACI_ID'] = result.crossBorderDetails.ACI_ID;
        this.existingPhotos = result.uploadedPhotos;
        this.existingDocs = result.uploadedDocs;

        if(result.uploadedPhotos != undefined && result.uploadedPhotos.length > 0){
          this.assetsImages = result.uploadedPhotos.map(x => ({
            path: `${this.Asseturl}/${result.carrierID}/${x}`, 
            name: x,
          }));
        }
  
        if(result.uploadedDocs != undefined && result.uploadedDocs.length > 0){
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

    const data = {
      assetID: this.assetID,
      assetIdentification: this.assetsData.assetIdentification,
      groupID: this.assetsData.groupID,
      VIN: this.assetsData.VIN,
      assetDetails:{
        assetType: this.assetsData.assetDetails.assetType,
        year: this.assetsData.assetDetails.year,
        manufacturer: this.assetsData.assetDetails.manufacturer,
        model: this.assetsData.assetDetails.model,
        length: this.assetsData.assetDetails.length,
        lengthUnit: this.assetsData.assetDetails.lengthUnit,
        axle: this.assetsData.assetDetails.axle,
        GVWR: this.assetsData.assetDetails.GVWR,
        GVWR_Unit: this.assetsData.assetDetails.GVWR_Unit,
        GAWR: this.assetsData.assetDetails.GAWR,
        GAWR_Unit: this.assetsData.assetDetails.GAWR_Unit,
        ownerShip: this.assetsData.assetDetails.ownerShip,
        currentStatus: this.assetsData.assetDetails.currentStatus,
        licenceCountryID: this.assetsData.assetDetails.licenceCountryID,
        licenceStateID: this.assetsData.assetDetails.licenceStateID,
        licencePlateNumber: this.assetsData.assetDetails.licencePlateNumber,
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
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/'([^']+)'/)[1];
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.toastr.success('Asset updated successfully.');
        this.router.navigateByUrl('/fleet/assets/list');
        this.Success = '';
      },
    });
  }
  /*
   * Selecting files before uploading
   */
  // selectDocuments(event, obj) {
  //   this.selectedFiles = event.target.files;
  //   if (obj === 'uploadedDocs') {
  //     //this.assetsData.uploadedDocs = [];
  //     for (let i = 0; i <= this.selectedFiles.item.length; i++) {
  //       const randomFileGenerate = this.selectedFiles[i].name.split('.');
  //       const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;
  //       this.selectedFileNames.set(fileName, this.selectedFiles[i]);
  //       this.assetsData.uploadedDocs.push(fileName);
  //     }
  //   } else {
  //     for (let i = 0; i <= this.selectedFiles.item.length; i++) {
  //       const randomFileGenerate = this.selectedFiles[i].name.split('.');
  //       const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;

  //       this.selectedFileNames.set(fileName, this.selectedFiles[i]);
  //       this.assetsData.uploadedPhotos.push(fileName);
  //     }
  //   }
  // }

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
  
  /*
   * Uploading files which selected
   */
  // uploadFiles = async () => {
  //   this.carrierID = await this.apiService.getCarrierID();
  //   this.selectedFileNames.forEach((fileData: any, fileName: string) => {
  //     this.awsUS.uploadFile(this.carrierID, fileName, fileData);
  //   });
  // }

  // Changing gvwr/gawr values
  gwr(value, el) {
    if (el === 'GVWR_Unit') {
      this.assetsData.assetDetails['GAWR_Unit'] = value;
    } else {
      this.assetsData.assetDetails['GVWR_Unit'] = value;
    }
  }

  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }

  
  fetchGroups() {
    this.apiService.getData(`groups?groupType=${this.groupData.groupType}`).subscribe((result: any) => {
      this.groups = result.Items;
    });
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
              this.throwErrors();
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


      },
    });
  }

  getStates(id) {
    this.spinner.show(); // loader init
    // const countryID = this.assetsData.assetDetails['licenceCountryID'];
    this.apiService.getData('states/country/' + id)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length-1];
    this.pdfSrc = '';
    if(ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url='+val+'&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  // delete uploaded images and documents 
  delete(type: string,name: string){
    this.apiService.deleteData(`assets/uploadDelete/${this.assetID}/${type}/${name}`).subscribe((result: any) => {
      this.fetchAssetByID();
    });
  }
}
