import { Component, OnInit } from '@angular/core';
import { ApiService, ListService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { DomSanitizer} from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
declare var $: any;

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css'],
})
export class AddInventoryComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  /**
   * form props
   */
  pageTitle = '';
  itemID = '';
  partNumber = '';
  cost = '';
  costUnit = '';
  quantity = '';
  itemName = '';
  description = '';
  category = '';
  warehouseID = '';
  aisle = '';
  row = '';
  bin = '';
  warehouseVendorID = '';
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
  warehoseForm = '';
  hasWarehouseSuccess = false;
  warehouseSuccess = '';
  pdfSrc: any;
  states = [];
  cities = [];

  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private toastr: ToastrService,
    private listService: ListService
  ) {
    this.itemID = this.route.snapshot.params[`itemID`];

    if (this.itemID) {
      this.pageTitle = `Edit Driver`;
      this.getInventory();
    } else {
      this.pageTitle = `Add Driver`;
    }

    $(document).ready(() => {
     // this.form = $('#form').validate();
      //this.groupForm = $('#groupForm').validate();
      //this.warehoseForm = $('#warehoseForm').validate();
    });
  }

   /*
   * Selecting files before uploading
   */
  selectDocuments(event, obj) {
    let files = [...event.target.files];

    if (obj === 'uploadedDocs') {
      for (let i = 0; i < files.length; i++) {
        this.uploadedDocs.push(files[i])
      }
    } else {
      for (let i = 0; i < files.length; i++) {
          this.uploadedPhotos.push(files[i])
      }
    }
  }

  getInventory() {
    this.apiService.getData('items/' + this.itemID).subscribe((result: any) => {
      result = result.Items[0];

      this.partNumber = result.partNumber;
      this.cost = result.cost;
      this.costUnit = result.costUnit;
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
      this.existingPhotos = result.uploadedPhotos;
      this.existingDocs = result.uploadedDocs;
      if(result.uploadedPhotos !== undefined && result.uploadedPhotos.length > 0){
       // this.allImages = result.uploadedPhotos;
        this.inventoryImages = result.uploadedPhotos.map(x => ({path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x}));
      }

      if(result.uploadedDocs !== undefined && result.uploadedDocs.length > 0){
       // this.alldocs = result.uploadedDocs;
        this.inventoryDocs = result.uploadedDocs.map(x => ({path:`${this.Asseturl}/${result.carrierID}/${x}`, name: x}));
      }
    });
  }
  /*Delete upload */
  delete(type: string,name: string){
    this.apiService.deleteData(`items/uploadDelete/${this.itemID}/${type}/${name}`).subscribe((result: any) => {
      this.getInventory();
    });
  }
  ngOnInit() {
    this.listService.fetchVendors();
    this.fetchWarehouses();

    this.vendors = this.listService.vendorList;
  }

  fetchWarehouses() {
    this.apiService.getData('items/get/warehouses').subscribe((result: any) => {
      this.warehouses = result.Items;
      console.log('this.warehouses', this.warehouses);
    });
  }


  getStates(countryCode: any) {
    this.stateCode = '';
    this.cityName = '';
    this.states = CountryStateCity.GetStatesByCountryCode([countryCode]);
  }
   getCities(countryCode: any, stateCode: any) {
    this.cityName = '';
    this.countryName = CountryStateCity.GetSpecificCountryNameByCode(countryCode);
    this.stateName = CountryStateCity.GetStateNameFromCode(stateCode, countryCode);
    this.cities   = CountryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
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
    this.hideErrors();

    const data = {
      partNumber: this.partNumber,
      cost: this.cost,
      costUnit: this.costUnit,
      quantity: this.quantity,
      itemName: this.itemName,
      description: this.description,
      category: this.category,
      warehouseID: this.warehouseID,
      aisle: this.aisle,
      row: this.row,
      bin: this.bin,
      warehouseVendorID: this.warehouseVendorID,
      trackingQuantity: this.trackingQuantity,
      reorderPoint: this.reorderPoint,
      reorderQuality: this.reorderQuality,
      leadTime: this.leadTime,
      preferredVendorID: this.preferredVendorID,
      days: this.days,
      time: this.time,
      notes: this.notes,
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

    this.apiService.postData('items/add/item', formData, true).subscribe({
      complete: () => {},
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
              this.Error = 'Please see the errors';
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.partNumber = '';
        this.cost = '';
        this.costUnit = '';
        this.quantity = '';
        this.itemName = '';
        this.description = '';
        this.category = '';
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
        this.toastr.success('Inventory Added Successfully');
        this.router.navigateByUrl('/fleet/inventory/list');
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
    this.hasSuccess = false;
    this.hideErrors();

    const data = {
      itemID: this.itemID,
      partNumber: this.partNumber,
      cost: this.cost,
      costUnit: this.costUnit,
      quantity: this.quantity,
      itemName: this.itemName,
      description: this.description,
      category: this.category,
      warehouseID: this.warehouseID,
      aisle: this.aisle,
      row: this.row,
      bin: this.bin,
      warehouseVendorID: this.warehouseVendorID,
      trackingQuantity: this.trackingQuantity,
      reorderPoint: this.reorderPoint,
      reorderQuality: this.reorderQuality,
      leadTime: this.leadTime,
      preferredVendorID: this.preferredVendorID,
      days: this.days,
      time: this.time,
      notes: this.notes,
      uploadedPhotos: this.existingPhotos,
      uploadedDocs: this.existingDocs
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

    this.apiService.putData('items', formData, true).subscribe({
      complete: () => {},
      error: (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.toastr.success('Inventory Updated Successfully');
        this.router.navigateByUrl('/fleet/inventory/list');
      },
    });
  }

  addWarehouse() {
    this.hasWarehouseSuccess = false;
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
      complete: () => {},
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
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
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
    if(ext === 'doc' || ext === 'docx' || ext === 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }
  setSrcValue(){
    this.pdfSrc = '';
  }
}
