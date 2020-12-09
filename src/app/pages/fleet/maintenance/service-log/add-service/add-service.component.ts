import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../../services';
import { v4 as uuidv4 } from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCalendar, NgbDateAdapter,  NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit {
  private groups;
  private vendors;
  vehicles;
  assets;
  tasks = [];
  newTaskResp;
  private reminders;
  private issues;
  private inventory = [];
  private selectedTasks = [];
  private selectedParts = [];
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
    allServiceTasks: {
      serviceTaskList : []
    },
    allServiceParts: {
      servicePartsList : []
    },
    uploadedDocuments : [],
    uploadedPhotos: []
  };
  totalLabors = 0;
  totalQuantity = 0;
  totalPartsPrice = 0;
  totalTasksAmount: any = '';
  totalPartsAmount: any = '';
  logID;

  tasksObject: any = {};

  constructor(
    private apiService: ApiService,
    private awsUS: AwsUploadService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
  ) {
    this.selectedFileNames = new Map<any, any>();
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
    this.fetchTasks();
    this.fetchAllTasksIDs();
  }

  /*
   * Add new asset
   */
  addService() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();
    console.log('this.serviceLogs', this.serviceData);
    this.apiService.postData('serviceLogs', this.serviceData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[val.context.key] = val.message;
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
        this.uploadFiles(); // upload selected files to bucket
        this.toastr.success('Log added successfully');
        this.router.navigateByUrl('/fleet/maintenance/service-log/list');
      },
    });
  }

  
  throwErrors() {
    console.log(this.errors);
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

  selectIssues($event, ids) {
    console.log($event.target.checked);
    if($event.target.checked) {
      this.selectedIssues.push(ids);
    } else {
      let index = this.selectedIssues.indexOf(ids);
      this.selectedIssues.splice(index, 1);
    }
    this.serviceData['selectedIssues'] = this.selectedIssues;
  }
  

  fetchGroups() {
    this.apiService.getData('groups').subscribe((result: any) => {
      this.groups = result.Items;
      // console.log('groups', this.groups)
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
      // console.log('vendors', this.vendors)
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
      this.serviceData['unitStatus'] = result.Items[0].currentStatus;
    });
  }

  /*
   * Get a vehicle by ID
   */
  fetchAssetByID(id) {
    this.apiService.getData(`assets/${id}`).subscribe(async (result: any) => {
      console.log('assets status', result);
      this.serviceData['unitStatus'] = await result.Items[0].assetDetails.currentStatus;
    });
  }

  /*
   * Get all assets from api
   */
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
      // console.log('assets', this.assets);
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
   * Get all stocks from api
   */
  fetchInventory() {
    this.apiService.getData('items').subscribe((result: any) => {
      result = result.Items;
      this.inventory = result;
      console.log('invertory', this.inventory);
      // for (const iterator of result) {
      //   this.inventory.push(iterator.name);
      // }
    });
  }
  

  getVehicleIssues(id) {
    const vehicleID = id;
    this.getReminders(vehicleID);
    this.fetchVehicleByID(vehicleID);
    this.apiService.getData(`issues/vehicle/${vehicleID}`).subscribe((result: any) => {
      this.issues = result.Items;
      console.log('this.issues', this.issues);
    });
  }

  getAssetIssues(id) {
    const assetID = id;
    console.log('assetID', assetID);
    this.getReminders(assetID);
    this.fetchAssetByID(assetID);
    this.apiService.getData(`issues/asset/${assetID}`).subscribe((result: any) => {
      this.issues = result.Items;
      // console.log('asset issues', this.issues);
    });
  }

  getReminders(id) {
    const vehicleID = id;
    this.apiService.getData(`reminders/vehicle/${vehicleID}`).subscribe(async (result: any) => {
      this.reminders = await result.Items;
      console.log("reminder", this.reminders);
      this.reminders.forEach(element => {
          element.buttonShow = false;
      });
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
        this.serviceData.uploadedDocuments.push(fileName);
      }
    } else {
      for (let i = 0; i <= this.selectedFiles.item.length; i++) {
        const randomFileGenerate = this.selectedFiles[i].name.split('.');
        const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;

        this.selectedFileNames.set(fileName, this.selectedFiles[i]);
        this.serviceData.uploadedPhotos.push(fileName);
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


  async addTasks() {
    console.log('value', this.selectedTasks);
    let remindID;
    let newSchedule;
    
    for (let remind of this.reminders) {
      // console.log('remind', remind);
      if (remind.reminderTasks.task === this.selectedTasks[this.selectedTasks.length - 1].taskID) {
        remindID = remind.reminderID;
        newSchedule = `Every ${remind.reminderTasks.odometer} Miles`;
      } else {
        remindID = ' ';
        newSchedule = ' ';
      }
    }
    console.log('sss', this.serviceData.allServiceTasks.serviceTaskList);
    
    this.serviceData.allServiceTasks.serviceTaskList.push({
      taskName: this.selectedTasks[this.selectedTasks.length - 1].taskName,
      taskID: this.selectedTasks[this.selectedTasks.length - 1].taskID,
      reminderID: remindID,
      schedule: newSchedule,
    });
    
  }

  remove(arr, data, i) {
    if (arr === 'tasks') {
      this.serviceData.allServiceTasks.serviceTaskList.splice(i, 1);
      this.totalLabors -= data.laborCost;
    } else {
      this.serviceData.allServiceParts.servicePartsList.splice(i, 1);
    }
  }

  clearTaks(arr) {
    if (arr === 'tasks') {
      this.serviceData.allServiceTasks.serviceTaskList = [];
    } else {
      this.serviceData.allServiceParts.servicePartsList = [];
    }
    
  }

  removeTasks(item) {
    console.log("remove item", item)
    this.serviceData.allServiceTasks.serviceTaskList.filter(s => {
      console.log("s", s)
      if (s.taskName === item.label) {
        let index = this.serviceData.allServiceTasks.serviceTaskList.indexOf(s);
        console.log("index", index)
        this.serviceData.allServiceTasks.serviceTaskList.splice(index, 1);
      }
  });
    console.log('allServiceTasks', this.serviceData.allServiceTasks);
  }

  
  calculateTasks() {
    let discountPercent = parseFloat(this.serviceData.allServiceTasks['discountPercent'] || 0);
    let taxPercent = parseFloat(this.serviceData.allServiceTasks['taxPercent'] || 0);
    let total = this.serviceData.allServiceTasks['total'];
    let subTotal = this.serviceData.allServiceTasks['subTotal'];
    if (isNaN(discountPercent)) {
      discountPercent = 0;
    }
    if (isNaN(total)) {
      total = 0;
    }
    if (isNaN(taxPercent)) {
      taxPercent = 0;
    }
    if (isNaN(subTotal)) {
      subTotal = 0;
    }
    let sum = 0;
    let tasksArr = this.serviceData.allServiceTasks.serviceTaskList;
    tasksArr.forEach(element => {
      if (element.laborCost !== undefined) {
        sum = sum + (parseFloat(element.laborCost) || 0);
      }
    });
    
    this.totalLabors = sum;
    this.serviceData.allServiceTasks['subTotal'] = sum;
    this.serviceData.allServiceTasks['total'] = sum;
    
    let discountAmount = (subTotal * discountPercent) / 100;
    this.serviceData.allServiceTasks['discountAmount'] = discountAmount;
    let taxAble = this.serviceData.allServiceTasks['total'] - discountAmount;
    let taxAmount = ( taxAble * taxPercent ) / 100;
    this.serviceData.allServiceTasks['taxAmount'] = taxAmount;
    this.serviceData.allServiceTasks['total'] -= discountAmount;
    this.serviceData.allServiceTasks['total'] += taxAmount;
  }

  calculateParts() {
    let discountPercent = parseFloat(this.serviceData.allServiceParts['discountPercent'] || 0);
    let taxPercent = parseFloat(this.serviceData.allServiceParts['taxPercent'] || 0);
    let total = this.serviceData.allServiceParts['total'];
    let subTotal = this.serviceData.allServiceParts['subTotal'];
    if (isNaN(discountPercent)) {
      discountPercent = 0;
    }
    if (isNaN(total)) {
      total = 0;
    }
    if (isNaN(taxPercent)) {
      taxPercent = 0;
    }
    if (isNaN(subTotal)) {
      subTotal = 0;
    }
    let countQuantity = 0;
    let countAmount = 0;
    let quantity = this.serviceData.allServiceParts.servicePartsList;
    quantity.forEach(element => {
      console.log('element',  element);
      if (element.quantity !== '' && element.rate !== '' ) {
        countQuantity += (parseFloat(element.quantity) || 0) ;
        element.partCost = (parseFloat(element.quantity) || 0) * (parseFloat(element.rate) || 0);
        countAmount += (parseFloat(element.partCost) || 0);
      }
      this.totalQuantity = countQuantity;
      this.totalPartsPrice = countAmount;
      subTotal = countAmount;
      this.serviceData.allServiceParts['total'] = countAmount;
      this.serviceData.allServiceParts['totalQuantity'] = countQuantity;
      this.serviceData.allServiceParts['subTotal'] = countAmount;
    });
    
    let discountAmount = (subTotal * discountPercent) / 100;
    this.serviceData.allServiceParts['discountAmount'] = discountAmount;
    let taxAble = this.serviceData.allServiceParts['total'] - discountAmount;
    let taxAmount = ( taxAble * taxPercent ) / 100;
    this.serviceData.allServiceParts['taxAmount'] = taxAmount;
    this.serviceData.allServiceParts['total'] -= discountAmount;
    this.serviceData.allServiceParts['total'] += taxAmount;
  }



  addParts() {
    console.log('parts', this.selectedParts);
    this.inventory.forEach(element => {
      if (element.name === this.selectedParts[this.selectedParts.length - 1].name) {
        console.log('this.inventory[i].name', element.name)
        console.log('this.selectedParts[this.selectedParts.length - 1]', this.selectedParts[this.selectedParts.length - 1].name)
        this.serviceData.allServiceParts.servicePartsList.push({
          partNumber: element.partNumber,
          description: element.description,
        });
      }
      
    });
  }



  fetchServiceByID() {
    // this.spinner.show(); // loader init
    this.apiService
      .getData('serviceLogs/' + this.logID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log('log', result);
        this.serviceData['logID'] = this.logID;
        this.serviceData['unitType'] = result.unitType;
        if (result.vehicleID) {
          this.getVehicleIssues(result.vehicleID);
          this.serviceData['vehicleID'] = result.vehicleID;
        } else {
          this.getAssetIssues(result.assetID);
          this.serviceData['assetID'] = result.assetID;
        }
        
        this.serviceData['odometer'] = result.odometer;
        this.serviceData['completionDate'] = result.completionDate;
        this.serviceData['vendorID'] = result.vendorID;
        this.serviceData['reference'] = result.reference;
        this.serviceData['location'] = result.location;
        this.serviceData['odometer'] = result.odometer;
        this.serviceData['description'] = result.description;
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
        for (var i = 0; i < result.allServiceParts.servicePartsList.length; i++) {
          newParts.push({
            description: result.allServiceParts.servicePartsList[i].description,
            partCost: result.allServiceParts.servicePartsList[i].partCost,
            partNumber: result.allServiceParts.servicePartsList[i].partNumber,
            quantity: result.allServiceParts.servicePartsList[i].quantity,
            rate: result.allServiceParts.servicePartsList[i].rate,
          });
          this.selectedParts.push(result.allServiceParts.servicePartsList[i].description);
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
      });
  }

  onChangeUnitType(value: any) {
    this.serviceData['unitType'] = value;
    if (value === 'asset') {
      delete this.serviceData['vehicleID'];
      delete this.serviceData['odometer'];
      this.serviceData.allServiceTasks.serviceTaskList = [];
      this.selectedTasks = [];
      this.serviceData.allServiceTasks['discountAmount'] = '';
      this.serviceData.allServiceTasks['discountPercent'] = '';
      this.serviceData.allServiceTasks['taxAmount'] = '';
      this.serviceData.allServiceTasks['taxPercent'] = '';
      this.serviceData.allServiceTasks['subTotal'] = '';
      this.serviceData.allServiceTasks['total'] = '';
      this.totalLabors = 0;
    } else {
      delete this.serviceData['assetID'];
    }
  }

   /*
   * Update Service Log
  */
 updateService() {
  console.log('serviceLogs', this.serviceData);
  this.apiService.putData('serviceLogs', this.serviceData).subscribe({
    complete: () => { },
    error: (err) => {
      from(err.error)
        .pipe(
          map((val: any) => {
            const path = val.path;
            // We Can Use This Method
            const key = val.message.match(/'([^']+)'/)[1];
            console.log(key);
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

  
}
