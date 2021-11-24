import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { HereMapService } from '../../../../../services';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { ListService } from '../../../../../services/list.service'
import { isTemplateHead } from 'typescript';
import { DomSanitizer } from '@angular/platform-browser';
import constants from "../../../constants";
declare var $: any;

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit {
  logurl = this.apiService.AssetUrl;
  groups;
  vendors;
  vehicles = [];
  assets = [];
  tasks: any = [];
  taskData: any = [];
  newTaskResp;
  reminders = [];
  issues: any;
  inventory = [];
  selectedTasks = [];
  selectedParts = [];
  selectedIssues = [];
  // private allServiceTasks = [];
  removeTask = false;
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  pageTitle: string;
  imageError = '';
  fileName = '';
  carrierID: any;
  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  submitDisabled = false;
  Error: string = '';
  Success: string = '';
  serviceData = {
    unitType: 'vehicle',
    reference: `Ref-${new Date().getTime()}`,
    unitID: '',
    odometer: '',
    completionDate: '',
    vendorID: '',
    description: '',
    taskIds: [],
    allServiceTasks: {
      serviceTaskList: [],
      subTotal: 0,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      total: 0,
      currency: 'CAD',
    },
    allServiceParts: {
      servicePartsList: [],
      totalQuantity: 0,
      subTotal: 0,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      total: 0,
      currency: 'CAD',
    },
    selectedIssues: [],
    location: '',
    geoCords: {
      lat: '',
      lng: ''
    },
    uploadedPhotos: [],
    uploadedDocs: []
  };

  uploadedPhotos = [];
  uploadedDocs = [];
  totalLabors = 0;
  totalQuantity = 0;
  totalPartsPrice = 0;
  totalTasksAmount: any = '';
  totalPartsAmount: any = '';
  logID;
  fetchedLocalData: any;
  tasksObject: any = {};
  localReminderUnitID: any;
  public searchTerm = new Subject<string>();
  public searchResults: any;
  newCoords = [];
  partType = 'existing';
  inventoryItems = [];
  partData = {
    partNumber: undefined,
    preferredVendorID: undefined,
    quantity: null,
    itemID: '',
    itemName: ''
  };
  itemData = {
    category: undefined,
    itemName: '',
    cost: '',
    costUnit: undefined,
    warehouseID: undefined
  };
  itemGroups = [];
  categoryData = {
    name: '',
    description: ''
  };
  warehouses = [];
  existingItemQuantity = null;

  inventoryQuantity: any = {};
  savedIssues = [];

  logImages = []
  logDocs = [];
  existingPhotos = [];
  existingDocs = [];
  vehicleDisabled = false;
  usersList: any = {};
  resolvedIssues: any = [];
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private hereMap: HereMapService,
    private domSanitizer: DomSanitizer,
    private listService: ListService
  ) {
    this.selectedFileNames = new Map<any, any>();
    // localStorage.setItem('serviceLogs', JSON.stringify(this.serviceData));
  }


  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  async ngOnInit() {
    this.logID = this.route.snapshot.params['logID'];
    if (this.logID) {
      this.pageTitle = 'Edit Service Log';
      this.vehicleDisabled = true;
      await this.fetchServiceByID();
    } else {
      this.pageTitle = 'New Service Log';
    }

    this.fetchGroups();
    await this.fetchVehicles();
    this.fetchUsersList();
    this.fetchInventory();
    await this.fetchAssets();

    this.listService.fetchVendors();
    this.listService.fetchTasks();
    this.fetchAllTasksIDs();
    this.fetchInventoryItems();
    this.fetchInventoryQuanitity();

    this.fetchedLocalData = JSON.parse(window.localStorage.getItem('unit'));
    if (this.fetchedLocalData) {
      if (this.fetchedLocalData.unitType === 'vehicle') {
        this.serviceData.unitID = this.fetchedLocalData.unitID;
        this.getVehicleIssues(this.fetchedLocalData.unitID);
        this.serviceData.unitType = 'vehicle';
        window.localStorage.removeItem('unit');
      }
      else {
        this.serviceData.unitType = 'asset';
        this.serviceData.unitID = this.fetchedLocalData.unitID;
        this.getAssetIssues(this.fetchedLocalData.unitID);
        window.localStorage.removeItem('unit');
      }
    }
    this.localReminderUnitID = JSON.parse(window.localStorage.getItem('reminderUnitID'));
    if (this.localReminderUnitID) {
      this.serviceData.unitID = this.localReminderUnitID.unitID;
      this.getVehicleIssues(this.localReminderUnitID.unitID);
      this.serviceData.unitType = 'vehicle';
      window.localStorage.removeItem('reminderUnitID');
    }

    this.taskData = this.listService.tasksList;
    // this.vendors = this.listService.vendorList;
    let vendorList = new Array<any>();
    this.getValidVendors(vendorList);
    this.vendors = vendorList;
  }

  private getValidVendors(vendorList: any[]) {
    let ids = [];
    this.listService.vendorList.forEach((element) => {
      element.forEach((element2) => {
        if (
          element2.isDeleted === 0 &&
          !ids.includes(element2.contactID)
        ) {
          vendorList.push(element2);
          ids.push(element2.contactID);
        }

        if (element2.isDeleted === 1 && this.serviceData.vendorID === element2.contactID) {
          this.serviceData.vendorID = null;
        }
      })
    })
  }
  /*
   * Add new asset
   */
  addService() {
    this.submitDisabled = true;
    this.hideErrors();
    this.spinner.show();

    // this.serviceData.allServiceParts.servicePartsList.forEach(elem => {
    //   delete elem.existQuantity;
    // });

    let taskIds = [];
    this.serviceData.allServiceTasks.serviceTaskList.forEach(elem => {
      taskIds.push(elem.taskID);
    });

    this.serviceData.taskIds = taskIds;

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
    formData.append('data', JSON.stringify(this.serviceData));

    this.apiService.postData('serviceLogs', formData, true).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
              this.spinner.hide();
            })
          )
          .subscribe({
            complete: () => {
              // this.throwErrors();
              this.spinner.hide();
              this.submitDisabled = false;
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => {

            },
          });
      },
      next: (res) => {
        this.response = res;
        this.submitDisabled = false;
        this.toastr.success('Service log added successfully');
        this.router.navigateByUrl('/fleet/maintenance/service-log/list');
        this.spinner.hide();
      },
    });

  }

  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error')
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

  selectIssues(event, ids: any) {

    if (event.target.checked) {
      if (!this.selectedIssues.includes(ids)) {
        this.selectedIssues.push(ids);
      }

    } else {
      let index = this.selectedIssues.indexOf(ids);
      this.selectedIssues.splice(index, 1);
    }
    this.serviceData.selectedIssues = this.selectedIssues;
  }

  fetchGroups() {
    this.apiService.getData('groups').subscribe((result: any) => {
      if (result != null) {
        this.groups = result.Items;
      } else {
        this.groups = [];
      }
    });
  }

  fetchAllTasksIDs() {
    this.apiService.getData('tasks/get/list')
      .subscribe((result: any) => {
        this.tasksObject = result;
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
   * Get all vehicles from api
   */
  async fetchVehicles() {
    let result: any = await this.apiService.getData('vehicles').toPromise();
    result.Items.forEach(element => {
      if (element.isDeleted === 0) {
        this.vehicles.push(element);
      }
      if (element.isDeleted === 1 && this.serviceData.unitID === element.vehicleID) {
        this.serviceData.unitID = null;
      }
    });
  }

  /*
   * Get a vehicle by ID
   */
  fetchVehicleByID(id) {
    this.apiService.getData(`vehicles/${id}`).subscribe((result: any) => {
      // this.serviceData['unitStatus'] = result.Items[0].currentStatus;
    });
  }

  /*
   * Get a assets by ID
   */
  fetchAssetByID(id) {
    this.apiService.getData(`assets/${id}`).subscribe(async (result: any) => {
      // this.serviceData['unitStatus'] = await result.Items[0].assetDetails.currentStatus;
    });
  }

  /*
   * Get all assets from api
   */
  async fetchAssets() {
    let result: any = await this.apiService.getData('assets').toPromise();
    result.Items.forEach(element => {
      if (element.isDeleted === 0) {
        this.assets.push(element);
      }
      if (element.isDeleted === 1 && this.serviceData.unitID === element.assetID) {
        this.serviceData.unitID = null;
      }
    });
  }


  /*
   * Get a task by id
   */
  fetchTaskbyID(taskID) {
    let result = this.apiService.getData('tasks/' + taskID).toPromise();
    return result;
  }

  /*
   * Get all stocks from api
   */
  fetchInventory() {
    this.apiService.getData('items/serviceLog/list').subscribe((result: any) => {
      this.inventory = result;
    });
  }
  fetchUsersList() {
    this.apiService.getData('users/get/list').subscribe((result: any) => {
      this.usersList = result;
    });
  }
  getResolvedIssues(id) {
    id = JSON.stringify(id);
    this.apiService.getData('issues/fetch/resolvedIssues?issueIds=' + id).subscribe((result: any) => {
      this.resolvedIssues = result;

      for (let i = 0; i < result.length; i++) {
        const element = result[i];
        element.selected = true;
        this.issues.push(element)

      }
    });
  }

  async getIssuesByVehicle(vehicleID) {

    await this.listService.fetchVehicleIssues(vehicleID);

    this.listService.issuesList.subscribe(res => {
      this.issues = [...this.resolvedIssues, ...res];
    });

  }
  async getIssuesByAsset(assetID) {

    await this.listService.fetchAssetsIssues(assetID);
    this.listService.issuesList.subscribe(res => {
      this.issues = [...this.resolvedIssues, ...res];

    });

  }
  async getVehicleIssues(id: any) {
    this.spinner.show();
    localStorage.setItem('issueVehicleID', JSON.stringify(id));
    this.spinner.show();
    const vehicleID = id;
    await this.getReminders(vehicleID);
    await this.getIssuesByVehicle(vehicleID);

    this.spinner.hide();
  }

  async getAssetIssues(id) {
    this.spinner.show();
    localStorage.setItem('issueVehicleID', JSON.stringify(id));
    const assetID = id;
    await this.getReminders(assetID);
    await this.getIssuesByAsset(assetID);

    this.spinner.hide();
  }

  async getReminders(id) {
    const vehicleID = id;
    this.reminders = [];
    this.apiService.getData(`reminders/vehicle/${vehicleID}`).subscribe(async (result: any) => {
      let response = await result.Items;
      response.forEach(element => {
        if (element.reminderType === 'service') {
          this.reminders.push(element);
          element.buttonShow = false;
        }
      });
    });
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

  addParts() {
    this.inventory.forEach(element => {
      if (element.itemID === this.selectedParts[this.selectedParts.length - 1].itemID) {
        this.serviceData.allServiceParts.servicePartsList.push({
          partName: element.itemName,
          partID: element.itemID,
          existQuantity: this.inventoryQuantity[element.partNumber],
          partNumber: element.partNumber,
          description: element.description,
        });
      }
    });
  }

  checkQuantity(index: number) {
    let reqQuantity = this.serviceData.allServiceParts.servicePartsList[index].quantity;
    let totalStocks = this.serviceData.allServiceParts.servicePartsList[index].existQuantity;
    if (reqQuantity > totalStocks) {
      this.toastr.error('The requested quantity is not available');
      this.serviceData.allServiceParts.servicePartsList[index].quantity = totalStocks;
    }
  }

  async addTasks() {
    let remindID;
    let newSchedule;

    for (let remind of this.reminders) {
      if (remind.reminderTasks.task === this.selectedTasks[this.selectedTasks.length - 1].taskID) {
        remindID = remind.reminderID;
        newSchedule = `Every ${remind.reminderTasks.remindByDays} days or ${remind.reminderTasks.odometer} Miles`;
      } else {
        remindID = '';
        newSchedule = '';
      }
    }
    this.serviceData.allServiceTasks.serviceTaskList.push({
      taskName: this.selectedTasks[this.selectedTasks.length - 1].taskName,
      taskID: this.selectedTasks[this.selectedTasks.length - 1].taskID,
      reminderID: remindID,
      schedule: newSchedule,
    });
  }

  async addListedTasks(data: any) {

    data.buttonShow = !data.buttonShow;
    let result = await this.fetchTaskbyID(data.reminderTasks.task);

    let task = result.Items[0].taskName;
    let ID = result.Items[0].taskID;
    this.selectedTasks.push(result.Items[0]);
    this.serviceData.allServiceTasks.serviceTaskList.push({
      taskName: task,
      taskID: ID,
      reminderID: data.reminderID,
      schedule: `Every ${data.reminderTasks.odometer} Miles`,
    });

  }

  removeListedTasks(data) {

    data.buttonShow = !data.buttonShow;
    let taskList = this.serviceData.allServiceTasks.serviceTaskList;
    let index = taskList.findIndex(item => item.taskID === data.reminderTasks.task);
    taskList.splice(index, 1);
  }

  remove(arr: any, data: any, i: number) {
    if (arr === 'tasks') {
      let remindersList = this.reminders;
      remindersList.findIndex(item => {
        if (item.reminderTasks.task === data.taskID) {
          item.buttonShow = !item.buttonShow;
        }
      });
      this.serviceData.allServiceTasks.serviceTaskList.splice(i, 1);
      // this.totalLabors -= data.laborCost;
      this.selectedTasks = this.selectedTasks.filter(elem => elem.taskName != data.taskName);
      this.calculateTasks();
    } else {
      this.serviceData.allServiceParts.servicePartsList.splice(i, 1);
      this.selectedParts = this.selectedParts.filter(elem => elem.itemID != data.partID
      );
      this.calculateParts();
    }
  }

  clearTaks(arr) {
    if (arr === 'tasks') {
      this.serviceData.allServiceTasks.serviceTaskList = [];
    } else {
      this.serviceData.allServiceParts.servicePartsList = [];
    }

  }

  removeTasks(item: any) {
    this.serviceData.allServiceTasks.serviceTaskList.filter(s => {
      if (s.taskName === item.label) {
        let index = this.serviceData.allServiceTasks.serviceTaskList.indexOf(s);
        this.serviceData.allServiceTasks.serviceTaskList.splice(index, 1);
        this.totalLabors -= s.laborCost;
        this.calculateTasks();
      }
      if (this.totalLabors === 0) {
        this.serviceData.allServiceTasks.discountPercent = 0;
        this.serviceData.allServiceTasks.taxPercent = 0;
        this.serviceData.allServiceTasks.total = 0;
      }
    });
  }

  removeParts(item: any) {
    this.serviceData.allServiceParts.servicePartsList.filter(s => {
      if (s.partNumber === item.value.partNumber) {
        let index = this.serviceData.allServiceParts.servicePartsList.indexOf(s);
        this.serviceData.allServiceParts.servicePartsList.splice(index, 1);
        // this.totalLabors -= s.laborCost;
        this.calculateParts();
      }
      if (this.totalLabors === 0) {
        this.serviceData.allServiceParts.discountPercent = 0;
        this.serviceData.allServiceParts.taxPercent = 0;
        this.serviceData.allServiceParts.total = 0;
      }
    });
  }


  calculateTasks() {
    let discountPercent = Number(this.serviceData.allServiceTasks.discountPercent);
    let taxPercent = Number(this.serviceData.allServiceTasks.taxPercent);
    // let total = Number(this.serviceData.allServiceTasks.total);
    let subTotal = Number(this.serviceData.allServiceTasks.subTotal);
    let sum = 0;
    let tasksArr = this.serviceData.allServiceTasks.serviceTaskList;
    tasksArr.forEach(element => {
      if (element.laborCost !== undefined) {
        sum = sum + (parseFloat(element.laborCost) || 0);
      }
    });
    this.totalLabors = sum;
    this.serviceData.allServiceTasks.subTotal = sum;

    if (discountPercent > 0) {
      this.serviceData.allServiceTasks.total = this.serviceData.allServiceTasks.subTotal - (this.serviceData.allServiceTasks.subTotal * discountPercent) / 100;
    } else {
      this.serviceData.allServiceTasks.total = sum;
    }
    if (taxPercent > 0) {
      let taxAble = (this.serviceData.allServiceTasks.total * taxPercent) / 100
      this.serviceData.allServiceTasks.total = this.serviceData.allServiceTasks.total + (this.serviceData.allServiceTasks.total * taxPercent) / 100;
      this.serviceData.allServiceTasks.taxAmount = taxAble;
    }
    let discountAmount = (subTotal * discountPercent) / 100;
    this.serviceData.allServiceTasks.discountAmount = discountAmount;

  }

  calculateParts() {
    let discountPercent = Number(this.serviceData.allServiceParts.discountPercent);
    let taxPercent = Number(this.serviceData.allServiceParts.taxPercent);
    // let total = Number(this.serviceData.allServiceParts.total);
    let subTotal = Number(this.serviceData.allServiceParts.subTotal);
    // if (isNaN(discountPercent)) {
    //   discountPercent = 0;
    // }
    // if (isNaN(total)) {
    //   total = 0;
    // }
    // if (isNaN(taxPercent)) {
    //   taxPercent = 0;
    // }
    // if (isNaN(subTotal)) {
    //   subTotal = 0;
    // }
    let countQuantity = 0;
    let countAmount = 0;
    let quantity = this.serviceData.allServiceParts.servicePartsList;
    quantity.forEach(element => {
      if (element.quantity !== '' && element.rate !== '') {
        countQuantity += (parseFloat(element.quantity) || 0);
        element.partCost = (parseFloat(element.quantity) || 0) * (parseFloat(element.rate) || 0);
        countAmount += (parseFloat(element.partCost) || 0);
      }
      this.totalQuantity = countQuantity;
      this.totalPartsPrice = countAmount;
      subTotal = countAmount;
      this.serviceData.allServiceParts.total = countAmount;
      this.serviceData.allServiceParts.totalQuantity = countQuantity;
      this.serviceData.allServiceParts.subTotal = countAmount;
    });

    let discountAmount = (subTotal * discountPercent) / 100;
    this.serviceData.allServiceParts.discountAmount = discountAmount;
    let taxAble = this.serviceData.allServiceParts.total - discountAmount;
    let taxAmount = (taxAble * taxPercent) / 100;
    this.serviceData.allServiceParts.taxAmount = taxAmount;
    this.serviceData.allServiceParts.total -= discountAmount;
    this.serviceData.allServiceParts.total += taxAmount;
  }


  async fetchServiceByID() {
    // this.spinner.show(); // loader init
    let result: any = await this.apiService
      .getData('serviceLogs/' + this.logID).toPromise();
    // .subscribe(async (result: any) => {
    result = result.Items[0];

    this.serviceData['logID'] = this.logID;
    this.serviceData.unitType = result.unitType;
    if (result.unitType == 'vehicle') {
      await this.getVehicleIssues(result.unitID);
      this.serviceData.unitID = result.unitID;
    } else {
      await this.getAssetIssues(result.unitID);
      this.serviceData.unitID = result.unitID;
    }

    this.serviceData.odometer = result.odometer;
    this.serviceData.completionDate = result.completionDate;
    this.serviceData.vendorID = result.vendorID;
    this.serviceData.reference = result.reference;
    // this.serviceData.location = result.location;
    this.serviceData.geoCords.lat = result.geoCords.lat;
    this.serviceData.geoCords.lng = result.geoCords.lng;
    this.serviceData.odometer = result.odometer;
    this.serviceData.description = result.description;

    this.savedIssues = result.selectedIssues;
    this.serviceData.selectedIssues = result.selectedIssues;

    let newTasks = [];
    for (var i = 0; i < result.allServiceTasks.serviceTaskList.length; i++) {
      newTasks.push({
        taskName: result.allServiceTasks.serviceTaskList[i].taskName,
        taskID: result.allServiceTasks.serviceTaskList[i].taskID,
        schedule: result.allServiceTasks.serviceTaskList[i].schedule,
        reminderID: result.allServiceTasks.serviceTaskList[i].reminderID,
        laborCost: result.allServiceTasks.serviceTaskList[i].laborCost,
      });
      this.selectedTasks.push(result.allServiceTasks.serviceTaskList[i].taskName)
    }
    this.serviceData.allServiceTasks['discountAmount'] = result.allServiceTasks['discountAmount'];
    this.serviceData.allServiceTasks['discountPercent'] = result.allServiceTasks['discountPercent'];
    this.serviceData.allServiceTasks['taxPercent'] = result.allServiceTasks['taxPercent'];
    this.serviceData.allServiceTasks['taxAmount'] = result.allServiceTasks['taxAmount'];
    this.serviceData.allServiceTasks['total'] = result.allServiceTasks['total'];
    this.serviceData.allServiceTasks['subTotal'] = result.allServiceTasks['subTotal'];
    this.totalLabors = result.allServiceTasks['subTotal'];

    this.serviceData.allServiceTasks.serviceTaskList = newTasks;
    let newParts = [];
    for (var j = 0; j < result.allServiceParts.servicePartsList.length; j++) {
      newParts.push({
        description: result.allServiceParts.servicePartsList[j].description,
        partCost: result.allServiceParts.servicePartsList[j].partCost,
        partNumber: result.allServiceParts.servicePartsList[j].partNumber,
        quantity: result.allServiceParts.servicePartsList[j].quantity,
        rate: result.allServiceParts.servicePartsList[j].rate,
        partName: result.allServiceParts.servicePartsList[j].partName,
      });
      this.selectedParts.push(result.allServiceParts.servicePartsList[j].partName);
    }
    this.serviceData.allServiceParts.servicePartsList = newParts;

    this.serviceData.allServiceParts['discountAmount'] = result.allServiceParts['discountAmount'];
    this.serviceData.allServiceParts['discountPercent'] = result.allServiceParts['discountPercent'];
    this.serviceData.allServiceParts['taxPercent'] = result.allServiceParts['taxPercent'];
    this.serviceData.allServiceParts['taxAmount'] = result.allServiceParts['taxAmount'];
    this.serviceData.allServiceParts['total'] = result.allServiceParts['total'];
    this.serviceData.allServiceParts['subTotal'] = result.allServiceParts['subTotal'];
    this.serviceData.allServiceParts['totalQuantity'] = result.allServiceParts['totalQuantity'];

    this.totalPartsPrice = result.allServiceParts['subTotal'];
    this.totalQuantity = result.allServiceParts['totalQuantity'];
    this.existingPhotos = result.uploadedPhotos;
    this.existingDocs = result.uploadedDocs;
    if (result.selectedIssues.length > 0) {
      this.getResolvedIssues(result.selectedIssues)
    }


    if (result.uploadedPhotos !== undefined && result.uploadedPhotos.length > 0) {
      this.logImages = result.uploadedPhotos.map(x => ({
        path: `${this.logurl}/${result.carrierID}/${x}`,
        name: x,
      }));
    }

    if (result.uploadedDocs !== undefined && result.uploadedDocs.length > 0) {
      this.logDocs = result.uploadedDocs.map(x => ({ path: `${this.logurl}/${result.carrierID}/${x}`, name: x }));
    }

    this.selectedIssues = result.selectedIssues;
    this.serviceData['timeCreated'] = result.timeCreated;
    // });
  }

  onChangeUnitType(value: any) {
    this.serviceData['unitType'] = value;
    this.issues = [];
    if (value === 'asset') {
      delete this.serviceData.odometer;
    }
  }

  /*
  * Update Service Log
 */
  updateService() {
    this.hideErrors();
    this.submitDisabled = true;

    let taskIds = [];
    this.serviceData.allServiceTasks.serviceTaskList.forEach(elem => {
      taskIds.push(elem.taskID);
    });

    this.serviceData.taskIds = taskIds;
    // if(this.serviceData.vehicleID == '' || this.serviceData.vehicleID == null) {
    //   delete this.serviceData.vehicleID;
    // }

    const data = {
      logID: this.logID,
      unitType: this.serviceData.unitType,
      reference: this.serviceData.reference,
      unitID: this.serviceData.unitID,
      odometer: this.serviceData.odometer,
      completionDate: this.serviceData.completionDate,
      vendorID: this.serviceData.vendorID,
      description: this.serviceData.description,
      taskIds: this.serviceData.taskIds,
      allServiceTasks: this.serviceData.allServiceTasks,
      allServiceParts: this.serviceData.allServiceParts,
      selectedIssues: this.serviceData.selectedIssues,
      location: this.serviceData.location,
      geoCords: this.serviceData.geoCords,
      uploadedPhotos: this.existingPhotos,

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
    this.apiService.putData('serviceLogs/', formData, true).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.spinner.hide(); // loader hide
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
        this.response = res;
        this.submitDisabled = false;
        this.hasSuccess = true;
        this.toastr.success('Service log Updated Successfully');
        this.router.navigateByUrl('/fleet/maintenance/service-log/list');
      },
    });
  }

  openReminders() {
    $('#serviceReminderModal').modal('show');
    let tasksList = this.serviceData.allServiceTasks.serviceTaskList;
    let reminders = this.reminders;
    tasksList.forEach(task => {
      reminders.forEach(remind => {
        if (task.taskID === remind.reminderTasks.task) {
          remind.buttonShow = true;
        }
      });
    });
  }

  async assignLocation(label) {
    const result = await this.hereMap.geoCode(label);
    const labelResult = result.items[0];
    this.serviceData.location = label;

    if (labelResult.position != undefined) {
      this.serviceData.geoCords = {
        lat: labelResult.position.lat,
        lng: labelResult.position.lat
      }
    }

    this.searchResults = false;
    $('div').removeClass('show-search__result');

  }

  gotoIssuePage() {
    // this.router.navigateByUrl('/fleet/maintenance/issues/add')
    this.listService.separateModals('logIssue');
    let selectedUnit: any = {
      type: this.serviceData.unitType,
      name: this.serviceData.unitID,
    }
    if (this.serviceData.unitType === 'vehicle') {
      selectedUnit.odometer = this.serviceData.odometer;
    } else {
      delete selectedUnit.odometer;
    }
    localStorage.setItem('logUnit', JSON.stringify(selectedUnit))
    this.listService.appendIssues(selectedUnit);
  }

  currencyChange(value: string) {
    this.serviceData.allServiceParts.currency = value;
    this.serviceData.allServiceTasks.currency = value;
  }

  async changePartTab(type) {
    if (type === 'new') {
      this.partType = 'new';
    } else {
      this.partType = 'existing';
    }
  }

  fetchInventoryItems() {
    this.apiService.getData('items').subscribe((result: any) => {
      this.inventoryItems = result.Items;
    });
  }
  fetchInventoryQuanitity() {
    this.apiService.getData('items/get/quantity').subscribe((result: any) => {
      this.inventoryQuantity = result;
    });
  }

  fetchPartNumber() {
    if (this.partData.partNumber !== undefined && this.partData.partNumber !== '') {
      this.apiService.getData('requiredItems/check/requestedItem/' + this.partData.partNumber).subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/'.*'/, 'This Field');
                this.errors[val.context.label] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.spinner.hide(); // loader hide
                // this.throwErrors();
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          if (res.Count > 0) {
            this.existingItemQuantity = parseInt(res.Items[0].quantity);
            this.partData.itemID = res.Items[0].itemID;
            // show modal
            $('#existingInvModal').modal('show');

          } else {
            this.addExistingPartNumber();
          }
        },
      });
    } else {
      return false;
    }
  }

  updateExistingPartNumber() {
    // let currQuan:any = parseInt(this.partData.quantity);
    this.partData.quantity = parseInt(this.partData.quantity) + parseInt(this.existingItemQuantity);
    this.apiService.putData('requiredItems', this.partData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.spinner.hide(); // loader hide
              // this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        $('#partModal').modal('hide');
        $('#existingInvModal').modal('hide');
        this.existingItemQuantity = null;
        this.partData = {
          partNumber: undefined,
          preferredVendorID: undefined,
          quantity: null,
          itemID: '',
          itemName: ''
        };
        this.itemData = {
          category: undefined,
          itemName: '',
          cost: '',
          costUnit: undefined,
          warehouseID: undefined
        }
        this.toastr.success('Part Updated Successfully');
      },
    });
  }

  addExistingPartNumber() {
    delete this.partData.itemID;
    this.apiService.postData('items/requireditems/addExistingItem', this.partData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.spinner.hide(); // loader hide
              // this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        $('#partModal').modal('hide');
        $('#existingInvModal').modal('hide');
        this.existingItemQuantity = null;
        this.partData = {
          partNumber: '',
          preferredVendorID: '',
          quantity: '',
          itemID: '',
          itemName: ''
        };
        this.itemData = {
          category: '',
          itemName: '',
          cost: '',
          costUnit: '',
          warehouseID: '',
        };
        this.toastr.success('Requested Item Added Successfully.');
      },
    });
  }

  getPartDetail(event) {
    let curr = this;
    this.inventoryItems.map(function (v) {
      if (v.partNumber == event) {
        curr.partData.quantity = v.quantity;
        curr.partData.preferredVendorID = v.preferredVendorID;
        curr.partData.itemName = v.itemName;
      }
    });
  }


  showCategoryModal() {
    this.categoryData.name = '';
    this.categoryData.description = '';
    $('#categoryModal').modal('show');
  }



  addInventory() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();

    const data = {
      partNumber: this.partData.partNumber,
      quantity: this.partData.quantity,
      itemName: this.itemData.itemName,
      category: this.itemData.category,
      preferredVendorID: this.partData.preferredVendorID,
      cost: this.itemData.cost,
      costUnit: this.itemData.costUnit,
      warehouseID: this.itemData.warehouseID,
      warehouseVendorID: this.partData.preferredVendorID,
    };

    this.apiService.postData('items/requireditems/addExistingItem', data).subscribe({
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
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        $('#partModal').modal('hide');
        this.toastr.success('Requested Item Added Successfully.');
        this.partData = {
          partNumber: '',
          preferredVendorID: '',
          quantity: '',
          itemID: '',
          itemName: ''
        };
        this.itemData = {
          category: '',
          itemName: '',
          cost: '',
          costUnit: '',
          warehouseID: '',
        };
      },
    });
  }

  closeExistingModel() {
    $('#existingInvModal').modal('hide');
    this.updateExistingPartNumber();
  }

  showPartModal() {
    this.existingItemQuantity = null;
    this.partData = {
      partNumber: undefined,
      preferredVendorID: undefined,
      quantity: null,
      itemID: '',
      itemName: ''
    };
    this.itemData = {
      category: undefined,
      itemName: '',
      cost: '',
      costUnit: undefined,
      warehouseID: undefined
    };
    $('#partModal').modal('show');
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length - 1];
    this.pdfSrc = '';
    if (ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  // delete uploaded images and documents
  delete(type: string, name: string, index: any) {
    this.apiService.deleteData(`serviceLogs/uploadDelete/${this.logID}/${type}/${name}`).subscribe((result: any) => {
      if (type === 'image') {
        this.logImages.splice(index, 1);
      } else {
        this.logDocs.splice(index, 1);
      }
    });
  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem('isOpen', 'true');
    this.listService.changeButton(false);
  }
  refreshVendorData() {
    this.listService.fetchVendors();
  }

  getTasks() {
    this.listService.fetchTasks();
  }
}
