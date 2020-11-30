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
@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit {
  private groups;
  private vendors;
  private vehicles;
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
    allServiceTasks: [],
    allServiceParts: [],
    uploadedDocuments : [],
    uploadedPhotos: []
  }
  totalLabors = 0;
  totalTasksAmount: any = '';
  totalPartsAmount: any = '';
  logID;

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
  }

  /*
   * Add new asset
   */
  addService() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
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
    this.form.showErrors(this.errors);
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
      console.log('groups', this.groups)
    });
  }


  /*
   * Get all vendors from api
   */
  fetchVendors() {
    this.apiService.getData('vendors').subscribe((result: any) => {
      this.vendors = result.Items;
      console.log('vendors', this.vendors)
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

  fetchInventory() {
    this.apiService.getData('items').subscribe((result: any) => {
      result = result.Items;
      this.inventory = result;
      console.log('invertory', this.inventory)
      // for (const iterator of result) {
      //   this.inventory.push(iterator.name);
      // }
    });
  }
  

  getIssues(id) {
    const vehicleID = id;
    this.getReminders(vehicleID);
    this.apiService.getData(`issues/vehicle/${vehicleID}`).subscribe((result: any) => {
      this.issues = result.Items;
      console.log('this.issues', this.issues);
    });
  }

  getReminders(id) {
    const vehicleID = id;
    this.apiService.getData(`reminders/vehicle/${vehicleID}`).subscribe((result: any) => {
      this.reminders = result.Items;
      console.log("reminder", this.reminders);
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

  addTasks() {
    console.log('value', this.selectedTasks);
    for(var i = 0; i < this.reminders.length; i++) {
      if (this.reminders[i].reminderTasks.task === this.selectedTasks[this.selectedTasks.length - 1]) {
        this.serviceData.allServiceTasks.push({
          task: this.selectedTasks[this.selectedTasks.length - 1],
          description: `Every ${this.reminders[i].reminderTasks.odometer} Miles`,
          labor: '',
        })
        this.removeTask = true;
        break;
      } else {
        this.serviceData.allServiceTasks.push({
          task: this.selectedTasks[this.selectedTasks.length - 1],
          description: '',
          labor: '',
        })
        break;
      }
    }
  
  }
  remove(arr, i) {
    if(arr === 'tasks') {
      this.serviceData.allServiceTasks.splice(i, 1);
    } else {
      this.serviceData.allServiceParts.splice(i, 1);
    }
    
  }

  clearTaks(arr) {
    if (arr === 'tasks') {
      this.serviceData.allServiceTasks = [];
    } else {
      this.serviceData.allServiceParts = [];
    }
    
  }

  removeTasks(item) {
    this.serviceData.allServiceTasks.filter(s => {if (s.task === item.value) {
      let index = this.serviceData.allServiceTasks.indexOf(s);
      this.serviceData.allServiceTasks.splice(index, 1);
    }});
    console.log('allServiceTasks', this.serviceData.allServiceTasks);
  }

  addLabors(event) {
    this.totalLabors +=  +event.target.value;
    console.log('totalLabors', this.totalLabors);
    this.totalTasksAmount = this.totalLabors;
  }

  discount(elem, $event) {
    if (elem === 'tasks') {
      this.totalTasksAmount = ((this.totalLabors / 100) * $event.target.value).toFixed(2);
      this.totalTasksAmount = this.totalLabors - this.totalTasksAmount;
      console.log('totalTasksAmount', this.totalTasksAmount);
    } else {

    }

    this.serviceData['amount'] = this.totalTasksAmount + this.totalPartsAmount;
    
  }

  addParts() {
    for(var i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i].name === this.selectedParts[this.selectedParts.length - 1]) {
        console.log('this.inventory[i].name', this.inventory[i].name)
        console.log('this.selectedParts[this.selectedParts.length - 1]', this.selectedParts[this.selectedParts.length - 1])
        this.serviceData.allServiceParts.push({
          name: this.inventory[i].name,
          description: this.inventory[i].description,
          quantity: '',
          amount: '',
          subTotal: ''
        });
      }
    }
  }


  fetchServiceByID() {
    // this.spinner.show(); // loader init
    this.apiService
      .getData('serviceLogs/' + this.logID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log('log', result);
        this.serviceData['logID'] = this.logID;
        this.serviceData['vehicleGroup'] = result.vehicleGroup;
        this.serviceData['vehicle'] = result.vehicle;

        this.getIssues(result.vehicle);
        this.serviceData['odometer'] = result.odometer;
        this.serviceData['completionDate'] = result.completionDate;
        this.serviceData['vendor'] = result.vendor;
        this.serviceData['reference'] = result.reference;
        this.serviceData['location'] = result.location;
        this.serviceData['odometer'] = result.odometer;
        this.serviceData['description'] = result.description;
        this.serviceData['amount'] = this.totalTasksAmount + this.totalPartsAmount;
        let newTasks = [];
        for (var i = 0; i < result.allServiceTasks.length; i++) {
          newTasks.push({
            description: result.allServiceTasks[i].description,
            labor: result.allServiceTasks[i].labor,
            task: result.allServiceTasks[i].task,
          });
          this.selectedTasks.push(result.allServiceTasks[i].task)
          this.totalLabors +=  +result.allServiceTasks[i].labor;
        }
        
        for (var i = 0; i < result.selectedIssues.length; i++) {
          this.getIssues(result.vehicle);
        }
        this.serviceData.allServiceTasks = newTasks;
        console.log('this.serviceData.allServiceTasks', this.serviceData.allServiceTasks);
        this.spinner.hide(); // hide loader
      });
  }

   /*
   * Update Service Log
  */
 updateService() {
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
  
}
