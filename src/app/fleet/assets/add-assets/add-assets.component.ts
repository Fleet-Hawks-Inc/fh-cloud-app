import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../aws-upload.service';
import { async } from '@angular/core/testing';
import { v4 as uuidv4 } from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';


declare var jquery: any;
declare var $: any;
declare var FileItem: any;

@Component({
  selector: 'app-add-assets',
  templateUrl: './add-assets.component.html',
  styleUrls: ['./add-assets.component.css'],
})
export class AddAssetsComponent implements OnInit {
  public assetID;
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  pageTitle: string;
  errors = {};
  form;
  quantumSelected = '';
  assetsData = {
    assetDetails: {},
    insuranceDetails: {},
    crossBorderDetails: {},
    uploadedPhotos: [],
    uploadedDocs: []
  };
  vendors = [];
  manufacturers = [];
  models = [];
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  imageError = '';
  fileName = '';
  carrierID: any;

  countries = [
    {
      id: 'Alabama',
      text: 'Alabama'
    },
    {
      id: 'Arkansas',
      text: 'Arkansas'
    },
    {
      id: 'California',
      text: 'California'
    },
    {
      id: 'New Hampshire',
      text: 'New Hampshire'
    },
    {
      id: 'New Jersey',
      text: 'New Jersey'
    },
    {
      id: 'Washington',
      text: 'Washington'
    },
    {
      id: 'Quebec',
      text: 'Quebec'
    },
    {
      id: 'Saskatchewen',
      text: 'Saskatchewen'
    }
  ];

  constructor(private apiService: ApiService, private awsUS: AwsUploadService, private route: ActivatedRoute,
              private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) {
      this.selectedFileNames = new Map<any, any>();
  }

  ngOnInit() {

    this.fetchManufactuer();
    this.fetchVendors();
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

  /*
   * Get all manufacturers from api
   */
  fetchManufactuer() {
    this.apiService.getData('manufacturers').subscribe((result: any) => {
      this.manufacturers = result.Items;
      console.log(this.manufacturers)
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
  getModels(event) {
    this.spinner.show(); // loader init
    const id = event.target.options[event.target.options.selectedIndex].id;
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
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    console.log('this.assetsData', this.assetsData);
    this.apiService.postData('assets', this.assetsData).subscribe({
      complete: () => { },
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              console.log(key);
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
        this.uploadFiles(); // upload selected files to bucket
        this.toastr.success('Asset added successfully');
        this.router.navigateByUrl('/fleet/assets/Assets-List');
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  /*
   * Fetch Asset details before updating
  */
  fetchAssetByID() {
    this.apiService
      .getData('assets/' + this.assetID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log('result', result);
        this.assetsData['assetID'] = this.assetID;
        this.assetsData['assetIdentification'] = result.assetIdentification;
        this.assetsData['VIN'] = result.VIN;
        this.assetsData['assetDetails']['assetType'] = result.assetDetails.assetType;
        this.assetsData['assetDetails']['year'] = result.assetDetails.year;
        this.assetsData['assetDetails']['manufacturer'] = result.assetDetails.manufacturer;
        // this.getModels();
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
        // this.assetsData['timeCreated'] = result.timeCreated;
        // this.assetsData['timeModified'] = result.timeModified;
      });

  }
  /*
   * Update asset
  */
  updateAsset() {
    this.hasError = false;
    this.hasSuccess = false;
    this.apiService.putData('assets', this.assetsData).subscribe({
      complete: () => { },
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              console.log(key);
              val.message = val.message.replace(/".*"/, 'This Field');
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
        this.toastr.success('Asset updated successfully');
        this.router.navigateByUrl('/fleet/assets/Assets-List');
        this.Success = '';
      },
    });
  }
  /*
   * Selecting files before uploading
   */
  selectDocuments(event, obj) {
    this.selectedFiles = event.target.files;
    if (obj === 'uploadedDocs') {
      //this.assetsData.uploadedDocs = [];
      for (let i = 0; i <= this.selectedFiles.item.length; i++) {
        const randomFileGenerate = this.selectedFiles[i].name.split('.');
        const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;
        this.selectedFileNames.set(fileName, this.selectedFiles[i]);
        this.assetsData.uploadedDocs.push(fileName);
      }
    } else {
      for (let i = 0; i <= this.selectedFiles.item.length; i++) {
        const randomFileGenerate = this.selectedFiles[i].name.split('.');
        const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;

        this.selectedFileNames.set(fileName, this.selectedFiles[i]);
        this.assetsData.uploadedPhotos.push(fileName);
      }
    }
  }
  /*
   * Uploading files which selected
   */
  uploadFiles = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    this.selectedFileNames.forEach((fileData: any, fileName: string) => {
      this.awsUS.uploadFile(this.carrierID, fileName, fileData);
    });
  }

  // Changing gvwr/gawr values
  gwr(value, el) {
    if (el === 'GVWR_Unit') {
      this.assetsData.assetDetails['GAWR_Unit'] = value;
    } else {
      this.assetsData.assetDetails['GVWR_Unit'] = value;
    }
  }
}
