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
  private allServices = [];
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
    uploadedDocuments : [],
    uploadedPhotos: []
  }
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
        this.toastr.success('Asset added successfully');
        this.router.navigateByUrl('/fleet/assets/Assets-List');
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
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
      for (const iterator of result) {
        this.inventory.push(iterator.name);
      }
    });
  }
  

  getIssues(id) {
    const vehicleID = id;
    this.getReminders(vehicleID);
    this.apiService.getData(`issues/vehicle/${vehicleID}`).subscribe((result: any) => {
      this.issues = result.Items;
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
    this.allServices.push({
      task: this.selectedTasks[this.selectedTasks.length - 1],
      description: '',
      labor: '',
    })
    console.log(this.allServices);
  }
  remove(i) {
    this.allServices.splice(i, 1);
  }

}
