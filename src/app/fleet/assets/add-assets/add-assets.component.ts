import { AfterViewInit, Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import { ApiService } from '../../../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-add-assets',
  templateUrl: './add-assets.component.html',
  styleUrls: ['./add-assets.component.css'],
})
export class AddAssetsComponent implements OnInit {
  public assetID;
  pageTitle: string;
  errors = {};
  form;
  quantumSelected = '';
  assetsData = {
    assetDetails: {},
    insuranceDetails: {},
    uploadedPhotos: {},
    uploadedDocs: {}
  };
  vendors = [];
  manufacturers = [];
  models = [];
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.fetchManufactuer();
    this.fetchVendors();
    this.assetID = this.route.snapshot.params[' assetID '];
    if (this.assetID) {
      this.pageTitle = 'Edit Asset';
      this.fetchAssetByID();
    }  else {
      this.pageTitle = 'Add Asset';
    }
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }


  fetchManufactuer() {
    this.apiService.getData('manufacturers').subscribe((result: any) => {
      this.manufacturers = result.Items;
    });
  }
  fetchVendors() {
    this.apiService.getData('vendors').subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }

  getModels() {
    this.apiService
      .getData(`vehicleModels/manufacturer/${this.assetsData.assetDetails[' manufacturerID ']}`)
      .subscribe((result: any) => {
        this.models = result.Items;
      });
  }


  addAsset() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    this.apiService.postData('assets', this.assetsData).subscribe({
      complete: () => {},
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
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
        this.response = res;
        this.toastr.success('Driver added successfully');
        this.router.navigateByUrl('/fleet/assets/Assets-List');
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  getAssetsbyStatus = () => {}
  
  
  fetchAssetByID() {
    this.apiService
      .getData('assets/' + this.assetID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.assetsData[' assetID '] = this.assetID;
        this.assetsData[' assetName '] = result.assetName;
        this.assetsData[' VIN '] = result.VIN;
        this.assetsData[' assetDetails '][' assetType '] = result.assetDetails.assetType;
        this.assetsData[' assetDetails '][' year '] = result.assetDetails.year;
        this.assetsData[' assetDetails '][' manufacturerID '] = result.assetDetails.manufacturerID;
        this.assetsData[' assetDetails '][' modelID '] = result.assetDetails.modelID;
        this.assetsData[' assetDetails '][' length '] = result.assetDetails.length;
        this.assetsData[' assetDetails '][' lengthType '] = result.assetDetails.lengthType;
        this.assetsData[' assetDetails '][' axle '] = result.assetDetails.axle;
        this.assetsData[' assetDetails '][' GVWR '] = result.assetDetails.GVWR;
        this.assetsData[' assetDetails '][' gvwrType '] = result.assetDetails.gvwrType;
        this.assetsData[' assetDetails '][' GAWR '] = result.assetDetails.GAWR;
        this.assetsData[' assetDetails '][' gawrType '] = result.assetDetails.gawrType;
        this.assetsData[' assetDetails '][' ownerShip '] = result.assetDetails.ownerShip;
        this.assetsData[' assetDetails '][' currentStatus '] = result.assetDetails.currentStatus;
        this.assetsData[' assetDetails '][' plateNumber '] = result.assetDetails.plateNumber;
        this.assetsData[' assetDetails '][' remarks '] = result.assetDetails.remarks;
        this.assetsData[' insuranceDetails '][' dateOfIssue '] = result.insuranceDetails.dateOfIssue;
        this.assetsData[' insuranceDetails '][' premiumAmount '] = result.insuranceDetails.premiumAmount;
        this.assetsData[' insuranceDetails '][' premiumCurrencyType '] = result.insuranceDetails.premiumCurrencyType;
        this.assetsData[' insuranceDetails '][' dateOfExpiry '] = result.insuranceDetails.dateOfExpiry;
        this.assetsData[' insuranceDetails '][' dateOfIssue '] = result.insuranceDetails.dateOfIssue;
        this.assetsData[' insuranceDetails '][' reminderBeforeExpiry '] = result.insuranceDetails.reminderBeforeExpiry;
        this.assetsData[' insuranceDetails '][' reminderType '] = result.insuranceDetails.reminderType;
        this.assetsData[' insuranceDetails '][' vendor '] = result.insuranceDetails.vendor;
        this.assetsData[' insuranceDetails '][' vendor '] = result.insuranceDetails.vendor;
        // this.assetsData['timeCreated'] = result.timeCreated;
        // this.assetsData['timeModified'] = result.timeModified;
      });

  }

  updateAsset() {
    this.hasError = false;
    this.hasSuccess = false;
    this.apiService.putData('assets', this.assetsData).subscribe({
      complete: () => {},
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
            error: () => {},
            next: () => {},
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
}
