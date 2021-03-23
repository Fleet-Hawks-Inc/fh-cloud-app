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
declare var $: any;

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit {
  groups;
  vendors;
  vehicles;
  assets;
  tasks: any;
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
  Error: string = '';
  Success: string = '';
  serviceData = {
    unitType: 'vehicle',
    reference: `Ref-${new Date().getTime()}`,
    vehicleID: '',
    assetID: '',
    odometer: '',
    completionDate: '',
    vendorID: '',
    description: '',
    allServiceTasks: {
      serviceTaskList : [],
      subTotal: 0,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      total: 0,
      currency: 'CAD',
    },
    allServiceParts: {
      servicePartsList : [],
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
    }
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
    partNumber:undefined,
    preferredVendorID:undefined,
    quantity: null,
    itemID: ''
  };
  itemData = {
    categoryID :undefined,
    itemName: '',
    cost: '',
    costUnit: undefined,
    warehouseID: undefined
  }
  itemGroups = [];
  categoryData = {
    name: '',
    description: ''
  };
  warehouses = [];
  existingItemQuantity = null;

  inventoryQuantity: any = {};
  savedIssues = [];
  
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private hereMap: HereMapService,
    private listService: ListService
  ) {
    this.selectedFileNames = new Map<any, any>();
    // localStorage.setItem('serviceLogs', JSON.stringify(this.serviceData));
   }

   
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  ngOnInit() {
    this.logID = this.route.snapshot.params['logID'];
    if (this.logID) {
      this.pageTitle = 'Edit Service Log';
      this.fetchServiceByID();
    } else {
      this.pageTitle = 'New Service Log';
      
    }



    this.fetchGroups();
    this.fetchVehicles();
    this.fetchVendors();
    this.fetchInventory();
    this.fetchAssets();
    // this.fetchTasks();
    this.listService.fetchTasks();
    this.fetchAllTasksIDs();    
    // this.searchLocation();
    this.fetchInventoryItems();
    this.fetchItemGroups();
    this.fetchInventoryQuanitity();

    this.fetchedLocalData = JSON.parse(window.localStorage.getItem('unit'));
    if(this.fetchedLocalData){
      if(this.fetchedLocalData.unitType === 'vehicle'){   
        this.serviceData.vehicleID =   this.fetchedLocalData.unitID;
        this.getVehicleIssues(this.fetchedLocalData.unitID);
        this.serviceData.unitType = 'vehicle';
        window.localStorage.removeItem('unit');
      }
      else{
       this.serviceData.unitType = 'asset';
       this.serviceData.assetID =   this.fetchedLocalData.unitID;
       this.getAssetIssues(this.fetchedLocalData.unitID);      
       window.localStorage.removeItem('unit');
      }
    }     
     this.localReminderUnitID = JSON.parse(window.localStorage.getItem('reminderUnitID'));
     if(this.localReminderUnitID) {
      this.serviceData.vehicleID =   this.localReminderUnitID.unitID;
      this.getVehicleIssues(this.localReminderUnitID.unitID);
      this.serviceData.unitType = 'vehicle';
      window.localStorage.removeItem('reminderUnitID');
     }

    //  if(this.serviceData.vehicleID != '') {
    //    this.getVehicleIssues(this.serviceData.vehicleID)
    //  } 
    //  if(this.serviceData.assetID != '') {
    //    this.getAssetIssues(this.serviceData.assetID);
    //  }

     this.tasks = this.listService.tasksList;
     
     
  }

  /*
   * Add new asset
   */
  addService() {
    
    this.hideErrors();
    this.spinner.show();
    this.serviceData.allServiceParts.servicePartsList.forEach(elem => {
      delete elem.existQuantity;
    })
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
              this.throwErrors();
              this.spinner.hide();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.toastr.success('Log added successfully');
        this.router.navigateByUrl('/fleet/maintenance/service-log/list');
        this.spinner.hide();
      },
    });
    if(this.serviceData.selectedIssues.length > 0){
      for(let i=0; i < this.serviceData.selectedIssues.length; i++){
        this.setIssueStatus(this.serviceData.selectedIssues[i]);
       }
    } 
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
    
    if(event.target.checked) {
      this.selectedIssues.push(ids);
    } else {
      let index = this.selectedIssues.indexOf(ids);
      this.selectedIssues.splice(index, 1);
    }
    this.serviceData.selectedIssues = this.selectedIssues;
  }
  /**
   * to set status of issue to resolved 
   */
  setIssueStatus(issueID) {
    const issueStatus = 'RESOLVED';
    this.apiService.getData('issues/setStatus/' + issueID + '/' + issueStatus).subscribe((result: any) => {});
  }
  fetchGroups() {
    this.apiService.getData('groups').subscribe((result: any) => {
      this.groups = result.Items;
      
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
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
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
   * Get a vehicle by ID
   */
  fetchAssetByID(id) {
    this.apiService.getData(`assets/${id}`).subscribe(async (result: any) => {
      // this.serviceData['unitStatus'] = await result.Items[0].assetDetails.currentStatus;
    });
  }

  /*
   * Get all assets from api
   */
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
    });
  }

  /*
   * Get all tasks from api
   */
  fetchTasks() {
    this.apiService.getData('tasks').subscribe((result: any) => {
      result.Items.forEach(element => {
        if (element.taskType === 'service') {
          this.tasks.push(element);
        }
      });
      
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
    this.apiService.getData('items').subscribe((result: any) => {
      result = result.Items;
      this.inventory = result;
    });
  }
  
  async getIssuesByVehicle(vehicleID) {
    await this.listService.fetchVehicleIssues(vehicleID);
    this.listService.issuesList.subscribe(res => {
      this.issues = res;
    });
    for (let z = 0; z < this.savedIssues.length; z++) {
      this.issues.map(elem => {
        if (elem.issueID == this.savedIssues[z]) {
          elem.selected = true;
        }
      })
    }
  }
  async getIssuesByAsset(assetID) {
    
    await this.listService.fetchAssetsIssues(assetID);
    this.listService.issuesList.subscribe(res => {
      this.issues = res;
    });
    for (let z = 0; z < this.savedIssues.length; z++) {
      this.issues.map(elem => {
        if (elem.issueID == this.savedIssues[z]) {
          elem.selected = true;
        }
      })
    }
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
          if(element.reminderType === 'service') {
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
          existQuantity:  this.inventoryQuantity[element.partNumber],
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
        remindID = ' ';
        newSchedule = ' ';
      }
    }
    this.serviceData.allServiceTasks.serviceTaskList.push({
      taskName: this.selectedTasks[this.selectedTasks.length - 1].taskName,
      taskID: this.selectedTasks[this.selectedTasks.length - 1].taskID,
      reminderID: remindID,
      schedule: newSchedule,
    });
    
  }

  async addListedTasks(data) {
    
    data.buttonShow = !data.buttonShow;
    let result = await this.fetchTaskbyID(data.reminderTasks.task);
    
    let task = result.Items[0].taskName;
    let ID = result.Items[0].taskID;
    this.selectedTasks.push(task);
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
        }});
      this.serviceData.allServiceTasks.serviceTaskList.splice(i, 1);
      // this.totalLabors -= data.laborCost;
      this.selectedTasks = this.selectedTasks.filter( elem => elem.taskName != data.taskName);
      this.calculateTasks();
    } else {
      this.serviceData.allServiceParts.servicePartsList.splice(i, 1);
      this.selectedParts = this.selectedParts.filter( elem => elem.itemID != data.partID
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
        if(this.totalLabors === 0) {
          this.serviceData.allServiceTasks.discountPercent = 0;
          this.serviceData.allServiceTasks.taxPercent = 0;
          this.serviceData.allServiceTasks.total = 0;
        }
    });
  
    
  }

  removeParts(item: any) {
    this.serviceData.allServiceParts.servicePartsList.filter(s => {
      if (s.partID === item.value) {
        let index = this.serviceData.allServiceParts.servicePartsList.indexOf(s);
        this.serviceData.allServiceParts.servicePartsList.splice(index, 1);
        // this.totalLabors -= s.laborCost; 
        this.calculateParts();
      }
      if(this.totalLabors === 0) {
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
   
    if(discountPercent > 0) {
      this.serviceData.allServiceTasks.total = this.serviceData.allServiceTasks.subTotal - (this.serviceData.allServiceTasks.subTotal * discountPercent) / 100;
    } else {
      this.serviceData.allServiceTasks.total = sum;
    }
    if(taxPercent > 0) {
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
      if (element.quantity !== '' && element.rate !== '' ) {
        countQuantity += (parseFloat(element.quantity) || 0) ;
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
    let taxAmount = ( taxAble * taxPercent ) / 100;
    this.serviceData.allServiceParts.taxAmount = taxAmount;
    this.serviceData.allServiceParts.total -= discountAmount;
    this.serviceData.allServiceParts.total += taxAmount;
  }


  async fetchServiceByID() {
    // this.spinner.show(); // loader init
    this.apiService
      .getData('serviceLogs/' + this.logID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.serviceData['logID'] = this.logID;
        this.serviceData.unitType = result.unitType;
        if (result.vehicleID) {
          this.getVehicleIssues(result.vehicleID);
          
          this.serviceData.vehicleID = result.vehicleID;
        } else {
          this.getAssetIssues(result.assetID);
          this.serviceData.assetID = result.assetID;
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
        
        this.selectedIssues = result.selectedIssues;
        this.serviceData['timeCreated'] = result.timeCreated;
      });
  }

  onChangeUnitType(value: any) {
    this.serviceData['unitType'] = value;
    if (value === 'asset') {
      delete this.serviceData.vehicleID;
      delete this.serviceData.odometer;
    } else {
      delete this.serviceData.assetID;
    }
  }

   /*
   * Update Service Log
  */
 updateService() {
   this.hideErrors();
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
  formData.append('data', JSON.stringify(this.serviceData));
  this.apiService.putData('serviceLogs', formData, true).subscribe({
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
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
    next: (res) => {
      this.response = res;
      this.hasSuccess = true;
      this.toastr.success('Service Updated Successfully');
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

  public searchLocation() {
    let target;
    this.searchTerm.pipe(
      map((e: any) => {
        $('.map-search__results').hide();
        $(e.target).closest('div').addClass('show-search__result');
        target = e;
        return e.target.value;
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        return this.hereMap.searchEntries(term);
      }),
      catchError((e) => {
        return throwError(e);
      }),
    ).subscribe(res => {
      this.searchResults = res;
    });
  }


  async assignLocation(label) {
    const result = await this.hereMap.geoCode(label);
    const labelResult = result.items[0];
    this.serviceData.location = label;

    if(labelResult.position != undefined) {
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
    $('#addIssuesModal').modal('show');
  }
  
  currencyChange(value: string) {
    this.serviceData.allServiceParts.currency = value;
    this.serviceData.allServiceTasks.currency = value;
  }

  async changePartTab(type) {
    if(type == 'new') {
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
    if (this.partData.partNumber != undefined && this.partData.partNumber != '') {
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
                this.throwErrors();
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          if(res.Count > 0) {
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

  updateExistingPartNumber () {
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
                this.throwErrors();
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
          partNumber:undefined,
          preferredVendorID:undefined,
          quantity:null,
          itemID: ''
        };
        this.itemData = {
          categoryID :undefined,
          itemName: '',
          cost: '',
          costUnit: undefined,
          warehouseID: undefined
        }
        this.toastr.success('Part Updated Successfully');
      },
    });
  }

  addExistingPartNumber () {
    delete this.partData.itemID;
    this.apiService.postData('requiredItems', this.partData).subscribe({
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
                this.throwErrors();
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
          partNumber:undefined,
          preferredVendorID:undefined,
          quantity:null,
          itemID: ''
        };
        this.itemData = {
          categoryID :undefined,
          itemName: '',
          cost: '',
          costUnit: undefined,
          warehouseID: undefined
        }
        this.toastr.success('Part Requested Successfully');
      },
    });
  }

  getPartDetail(event) {
    let curr = this;
    this.inventoryItems.map(function(v){
      if(v.partNumber == event){
        curr.partData.quantity = v.quantity;
        curr.partData.preferredVendorID = v.preferredVendorID;
      }
    })
  }

  fetchItemGroups() {
    this.apiService.getData(`itemGroups`).subscribe((result) => {
      this.itemGroups = result.Items;
    });
  }

  showCategoryModal() {
    this.categoryData.name = "";
    this.categoryData.description = "";
    $("#categoryModal").modal("show");
  }

  addGroup() {
    this.hideErrors();

    const data = {
      groupName: this.categoryData.name,
      groupDescription: this.categoryData.description,
    };

    this.apiService.postData("itemGroups", data).subscribe({
      complete: () => {},
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
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
        this.categoryData.name = "";
        this.categoryData.description = "";
        this.fetchItemGroups();
        $("#categoryModal").modal("hide");
        this.toastr.success('Category Added successfully');
      },
    });
  }

  addInventory() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();

    const data = {
      partNumber: this.partData.partNumber,
      quantity: 0,
      itemName: this.itemData.itemName,
      categoryID: this.itemData.categoryID,
      preferredVendorID: this.partData.preferredVendorID,
      cost: this.itemData.cost,
      costUnit: this.itemData.costUnit,
      warehouseID: this.itemData.warehouseID,
      warehouseVendorID: this.partData.preferredVendorID,
    };

    // create form data instance
    const formData = new FormData();

    //append other fields
    formData.append('data', JSON.stringify(data));
    
    this.apiService.postData("items", formData, true).subscribe({
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
              this.throwErrors();
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
        this.addExistingPartNumber();
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
      itemID: ''
    };
    this.itemData = {
      categoryID: undefined,
      itemName: '',
      cost: '',
      costUnit: undefined,
      warehouseID: undefined
    }
    $("#partModal").modal('show');
  }

}
