import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../../services';
import { v4 as uuidv4 } from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit {
  private groups;
  private vendors;
  private vehicles;
  private issues;
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
    private spinner: NgxSpinnerService
  ) {
    this.selectedFileNames = new Map<any, any>();
   }

  ngOnInit() {
    this.fetchGroups();
    this.fetchVehicles();
    this.fetchVendors();
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
  

  fetchGroups() {
    this.apiService.getData('groups').subscribe((result: any) => {
      this.groups = result.Items;
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
      console.log('this.vehicles', this.vehicles);
    });
  }

  getIssues(id) {
    console.log('id', id);
    const vehicleID = id;
    this.apiService.getData(`issues/${vehicleID}`).subscribe((result: any) => {
      this.issues = result.Items;
      console.log('this.issues', this.issues);
    });
  }
  // /*
  //  * Get all issues from api
  //  */
  // fetchIssues() {
  //   this.apiService.getData(`issues/${this.vehicleID}`).subscribe((result: any) => {
  //     this.issues = result.Items;
  //     console.log('this.issues', this.issues);
  //   });
  // }


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

}
