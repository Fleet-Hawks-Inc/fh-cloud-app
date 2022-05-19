import { Component,OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService, ListService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from "@angular/forms";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { from, Subject, throwError } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from "../../../../services/modal.service";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil
} from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';
import { UnsavedChangesComponent } from 'src/app/unsaved-changes/unsaved-changes.component';

declare var $: any;

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css'],
})
export class AddInventoryComponent implements OnInit, OnDestroy
{
  @ViewChild('inventoryF') inventoryF: NgForm;
  takeUntil$ = new Subject();
  Asseturl = this.apiService.AssetUrl;
  /**
   * form props
   */
  pageTitle = '';
  itemID = '';
  requiredItem: '';
  partNumber = '';

  cost = 0;
  tax = 0;
  totalCost = 0;
  costUnit = null;
  quantity = 0;
  itemName = '';
  description = '';
  category = null;
  warehouseID = '';

  costUnitType = null;
  warrantyTime: '';
  warrantyUnit: '';
  aisle = '';
  row = '';
  bin = '';
  warehouseVendorID = null;
  trackingQuantity = '';
  reorderPoint = '';
  reorderQuality = '';
  leadTime = '';
  preferredVendorID = '';
  days = '';
  time = '';
  notes = '';
  photos = [];
  documents = [];
  vendors: any = [];
  warehouses = [];
  existingPhotos = [];
  existingDocs = [];
  uploadedPhotos = [];
  uploadedDocs = [];
  public inventoryDocs = [];
  public inventoryImages = [];
  /**
   * group props
   */
  groupName = '';
  groupDescription = '';
  groupForm = '';
  hasGroupSuccess = false;

  groupSuccess = '';

  /**
   * warehouse props
   */
  warehouseName = '';
  countryName = '';
  countryCode = '';
  stateName = '';
  stateCode = '';
  cityName = '';
  zipCode = '';
  address = '';
  isSubmitted = false;
  warehoseForm = '';
  hasWarehouseSuccess = false;
  warehouseSuccess = '';
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');
  states = [];
  cities = [];

  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  submitDisabled = false;
  Error = '';
  Success = '';
  categories: any = [];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private modalServiceOwn: ModalService,
    private listService: ListService,
    private countryStateCity: CountryStateCityService
  ) {
      this.modalServiceOwn.triggerRedirect.next(false);
    this.router.events.pipe(takeUntil(this.takeUntil$)).subscribe((v: any) => {
      if (v.url !== "undefined" || v.url !== "") {
        this.modalServiceOwn.setUrlToNavigate(v.url);
      }
    });
    this.modalServiceOwn.triggerRedirect$
      .pipe(takeUntil(this.takeUntil$))
      .subscribe((v) => {
        if (v) {
          this.router.navigateByUrl(
            this.modalServiceOwn.urlToRedirect.getValue()
          );
        }
      });
    this.itemID = this.route.snapshot.params[`itemID`];
    this.requiredItem = this.route.snapshot.params[`item`];
    if (this.itemID) {
      this.pageTitle = `Edit Inventory Part`;
      this.getInventory();
    } else {
      this.pageTitle = `Add Inventory Part`;
    }
    if (this.requiredItem) {
      this.pageTitle = `Add Inventory Part`;
      this.getRequiredInventory();
    }
    this.disableButton()
  }

  canLeave(): boolean {
     if (this.inventoryF.dirty && !this.isSubmitted) {
       if (!this.modalService.hasOpenModals()) {
         let ngbModalOptions: NgbModalOptions = {
           backdrop: "static",
           keyboard: false,
           size: "sm",
         };
         this.modalService.open(UnsavedChangesComponent, ngbModalOptions);
       }
       return false;
     }
     this.modalServiceOwn.triggerRedirect.next(true);
     this.takeUntil$.next();
    this.takeUntil$.complete();
    return true;
  }


  /*
  * Selecting files before uploading
  */
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
  calculateAmount()
  {
     this.totalCost = (this.cost * this.quantity) + this.tax;
  }

  getRequiredInventory() {
    this.apiService.getData('items/required/' + this.requiredItem).subscribe((result: any) => {
      result = result.Items[0];
      this.partNumber = result.partNumber;
      this.quantity = result.quantity;
      this.itemName = result.itemName;
      this.description = result.description;
      this.preferredVendorID = result.preferredVendorID;

    });
  }
  getInventory() {
    this.apiService.getData('items/' + this.itemID).subscribe((result: any) => {
      result = result.Items[0];

      this.partNumber = result.partNumber;
      this.cost = result.cost;
      this.totalCost = result.totalCost;
      this.tax = result.tax;
      this.costUnit = result.costUnit;
      this.costUnitType = result.costUnitType;
      this.quantity = result.quantity;
      this.itemName = result.itemName;
      this.description = result.description;
      this.category = result.category;
      this.warehouseID = result.warehouseID;
      this.aisle = result.aisle;
      this.row = result.row;
      this.bin = result.bin;
      this.warehouseVendorID = result.warehouseVendorID;
      this.trackingQuantity = result.trackingQuantity;
      this.reorderPoint = result.reorderPoint;
      this.reorderQuality = result.reorderQuality;
      this.leadTime = result.leadTime;
      this.preferredVendorID = result.preferredVendorID;
      this.days = result.days;
      this.time = result.time;
      this.notes = result.notes;
      this.warrantyTime = result.warrantyTime,
        this.warrantyUnit = result.warrantyUnit,
        this.existingPhotos = result.uploadedPhotos;
      this.existingDocs = result.uploadedDocs;
      if (result.uploadedPhotos !== undefined && result.uploadedPhotos.length > 0) {
          this.inventoryImages = result.uploadedPics;
        // this.allImages = result.uploadedPhotos;
        //this.inventoryImages = result.uploadedPhotos.map(x => ({ path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x }));
      }

      if (result.uploadedDocs !== undefined && result.uploadedDocs.length > 0) {
         this.inventoryDocs = result.uploadDocument;
        // this.alldocs = result.uploadedDocs;
        //this.inventoryDocs = result.uploadedDocs.map(x => ({ path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x }));
      }
    });
  }
  /*Delete upload */
  delete(type: string, name: string, index: any) {
    this.apiService.deleteData(`items/uploadDelete/${this.itemID}/${type}/${name}`).subscribe((result: any) => {
      this.getInventory();
      if (type == 'doc') {
        this.inventoryDocs.splice(index, 1);
      } else {
        this.inventoryImages.splice(index, 1);
      }
    });

  }
  ngOnInit() {
    this.listService.fetchVendors();
    this.fetchWarehouses();

    this.fetchCategories();

    this.vendors = this.listService.vendorList;
  }

  fetchWarehouses() {
    this.apiService.getData('items/get/warehouses').subscribe((result: any) => {
      this.warehouses = result.Items;
    });
  }


  async getStates(countryCode: any) {
    this.stateCode = '';
    this.cityName = '';
    this.states = await this.countryStateCity.GetStatesByCountryCode([countryCode]);
  }
  async getCities(countryCode: any, stateCode: any) {
    this.cityName = '';
    this.countryName = await this.countryStateCity.GetSpecificCountryNameByCode(countryCode);
    this.stateName = await this.countryStateCity.GetStateNameFromCode(stateCode, countryCode);
    this.cities = await this.countryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
  }

  showWarehoseModal() {
    $('#warehouseModal').modal('show');
  }

  showCategoryModal() {
    $('#categoryModal').modal('show');
  }

  fetchVendors() {
    this.apiService.getData(`vendors`).subscribe((result) => {
      this.vendors = result.Items;
    });
  }


  addInventory() {
    this.hasError = false;
    this.hasSuccess = false;
    this.submitDisabled = true;
    this.hideErrors();
    if (this.category !== null && this.category.label != undefined) {
      this.category = this.category.label;
    } else {
      this.category = this.category;
    }
    const data = {
      partNumber: this.partNumber,
      cost: this.cost,
      totalCost:this.totalCost,
      costUnitType: this.costUnitType,
      costUnit: this.costUnit,
      tax:this.tax,
      quantity: this.quantity,
      itemName: this.itemName,
      description: this.description,
      category: this.category,
      warehouseID: this.warehouseID,
      aisle: this.aisle,
      row: this.row,
      bin: this.bin,
      warehouseVendorID: this.warehouseVendorID,
      days: this.days,
      time: this.time,
      notes: this.notes,
      warrantyTime: this.warrantyTime,
      warrantyUnit: this.warrantyUnit
    };

    // create form data instance
    const formData = new FormData();

    // append photos if any
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    // append docs if any
    for (let j = 0; j < this.uploadedDocs.length; j++) {
      formData.append('uploadedDocs', this.uploadedDocs[j]);
    }

    // append other fields
    formData.append('data', JSON.stringify(data));

    this.apiService.postData('items/add/item', formData, true).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              // this.throwErrors();
              this.hasError = true;
              this.submitDisabled = false;
              this.Error = 'Please see the errors';
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => { },
          });
      },
      next: (res) => {
        if (res === true) {
          this.toastr.error('Part number already exists,please edit the existing entry');
        } else {
          this.response = res;
          this.hasSuccess = true;
          this.partNumber = '';

          this.cost = 0;
          this.totalCost = 0;
          this.tax = 0;
          this.costUnit = null;
          this.quantity = 0;

          this.itemName = '';
          this.description = '';
          this.category = null;
          this.warehouseID = '';
          this.aisle = '';
          this.row = '';
          this.bin = '';
          this.warehouseVendorID = '';
          this.trackingQuantity = '';
          this.reorderPoint = '';
          this.reorderQuality = '';
          this.leadTime = '';
          this.preferredVendorID = '';
          this.days = '';
          this.time = '';
          this.notes = '';
          this.warrantyTime = '',
          this.warrantyUnit = ''
          this.modalServiceOwn.triggerRedirect.next(true);
          this.takeUntil$.next();
          this.takeUntil$.complete();
          this.toastr.success('Inventory Added Successfully');
          this.isSubmitted = true;
          this.router.navigateByUrl('/fleet/inventory/list');
          if (this.requiredItem) {
            this.deleteRequiredItem(this.requiredItem);
          }
        }

      },
    });
  }
  deleteRequiredItem(requiredItem: any) {
    // let record = {
    //   eventID: requiredItem
    // }
    this.apiService.deleteData(`items/delete/required/item/${requiredItem}`).subscribe((result: any) => {
      this.toastr.success('Required Inventory Item Deleted Successfully!');
    });
  }
  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
  }

  hideErrors() {
    from(Object.keys(this.errors)).subscribe((v) => {
      $('[name="' + v + '"]')
        .removeClass('error')
        .next()
        .remove('label');
    });
    this.errors = {};
  }



  updateInventory() {
    this.hasError = false;
    this.submitDisabled = true;
    this.hasSuccess = false;
    this.hideErrors();
    if (this.category !== null && this.category.label != undefined) {
      this.category = this.category.label;
    } else {
      this.category = this.category;
    }
    const data = {
      itemID: this.itemID,
      partNumber: this.partNumber,
      cost: this.cost,
      costUnit: this.costUnit,
      tax: this.tax,
      totalCost:this.totalCost,
      costUnitType: this.costUnitType,
      quantity: this.quantity,
      itemName: this.itemName,
      description: this.description,
      category: this.category,
      warehouseID: this.warehouseID,
      aisle: this.aisle,
      row: this.row,
      bin: this.bin,
      warehouseVendorID: this.warehouseVendorID,
      notes: this.notes,
      warrantyTime: this.warrantyTime,
      warrantyUnit: this.warrantyUnit,
      uploadedPhotos: this.existingPhotos,
      uploadedDocs: this.existingDocs
    };
    // create form data instance
    const formData = new FormData();

    // append photos if any
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }
    // append docs if any
    for (let j = 0; j < this.uploadedDocs.length; j++) {
      formData.append('uploadedDocs', this.uploadedDocs[j]);
    }

    // append other fields
    formData.append('data', JSON.stringify(data));

    this.apiService.putData('items', formData, true).subscribe({
      complete: () => { },
      error: (err) => {
        this.hasError = true;
        this.Error = err.error;
        this.submitDisabled = false;
      },
      next: (res) => {

        if (res === true) {
          this.toastr.error('Part number already exists,please edit the existing entry');
        } else {

          this.response = res;
           this.isSubmitted = true;
          this.modalServiceOwn.triggerRedirect.next(true);
          this.takeUntil$.next();
          this.takeUntil$.complete();
          this.toastr.success('Inventory Updated Successfully');
          this.router.navigateByUrl('/fleet/inventory/list');
        }
      },
    });
  }

  addWarehouse() {
    this.hasWarehouseSuccess = false;
    this.submitDisabled = true;
    this.hideErrors();

    const data = {
      warehouseName: this.warehouseName,
      countryCode: this.countryCode,
      countryName: this.countryName,
      stateCode: this.stateCode,
      stateName: this.stateName,
      cityName: this.cityName,
      zipCode: this.zipCode,
      address: this.address,
    };
    this.apiService.postData('items/add/warehouse', data).subscribe({
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
              this.submitDisabled = false;
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
        this.hasWarehouseSuccess = true;
        this.warehouseSuccess = 'Warehouse Added successfully';
        this.warehouseName = '';
        this.countryCode = '';
        this.stateCode = '';
        this.countryName = '';
        this.stateName = '';
        this.cityName = '';
        this.zipCode = '';
        this.address = '';
        this.fetchWarehouses();
        $('#warehouseModal').modal('hide');
        
        this.toastr.success('Warehouse Added successfully');
      },
    });
  }
  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length - 1];
    this.pdfSrc = '';
    if (ext === 'doc' || ext === 'docx' || ext === 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }
  setSrcValue() {
    this.pdfSrc = '';
  }
  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem('isOpen', 'true');
    this.listService.changeButton(false);
  }

  ngOnDestroy(): void {
    this.takeUntil$.next();
    this.takeUntil$.complete();
  }



  disableButton() {
    if (this.partNumber == '' || this.costUnit == '' || this.costUnit == null || this.costUnitType == '' || this.costUnitType == null ||
      this.category == '' || this.category == null
      || this.warehouseID == '' || this.warehouseID == null || this.warehouseVendorID == '' || this.warehouseVendorID == null) {
      return true;
    } else {
      return false;
    }
  }

  getWarehouses() {
    this.fetchWarehouses();
  }

  getVendors() {
    this.listService.fetchVendors();
  }

  fetchCategories() {
    this.httpClient.get('assets/jsonFiles/inventory/category.json').subscribe((data: any) => {
      data.forEach(element => {
        this.categories.push(element)
      });

    });
  }
}