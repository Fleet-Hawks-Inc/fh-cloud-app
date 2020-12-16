import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-add-alert',
  templateUrl: './add-alert.component.html',
  styleUrls: ['./add-alert.component.css']
})
export class AddAlertComponent implements OnInit {
  title = 'Add Alert';
  alertID: string;
  alert = {
    otherEmails: []
  };
  vehicles = [];
  groups = [];
  assets = [];
  users  = [];
  geofences = [];
  drivers = [];
  otherEmails: string;
  errors = {};
  alertForm;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService,
              private location: Location, private spinner: NgxSpinnerService,) { }

  ngOnInit() {
    this.fetchVehicles();
    this.fetchGroups();
    this.fetchAssets();
    this.fetchUsers();
    this.fetchGeofences();
    this.fetchDrivers();
    this.alertID = this.route.snapshot.params['alertID'];
    if (this.alertID) {
      this.title = 'Edit Alert';
      this.fetchAlertByID();
    } else {
      this.title = 'Add Alert';
    }
    $(document).ready(() => {
      this.alertForm = $('#alertForm').validate();
    });
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  fetchGroups() {
    this.apiService.getData('groups').subscribe((result: any) => {
      this.groups = result.Items;
    });
  }
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
    });
  }
  fetchDrivers() {
    this.apiService.getData('drivers').subscribe((result: any) => {
      this.drivers = result.Items;
    });
  }
  fetchUsers() {
    this.apiService.getData('users').subscribe((result: any) => {
      this.users = result.Items;
    });
  }
  fetchGeofences() {
    this.apiService.getData('geofences').subscribe((result: any) => {
      this.geofences = result.Items;
    });
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  addAlert() {
    if(this.otherEmails){
      this.alert.otherEmails = this.otherEmails.split(',');  
    }     
    // if (this.fileName === '') {
    //   this.imageError = 'Please Choose Image To Upload';
    //   return;
    // }
    this.hideErrors(); 
    this.apiService.postData('alerts', this.alert).subscribe({
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
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.toastr.success('Alert Added successfully');
        this.router.navigateByUrl('/alert-list');
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
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label');
      });
    this.errors = {};
  }

  fetchAlertByID() {
    this.spinner.show(); // loader init
    this.apiService
      .getData('alerts/' + this.alertID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.alert[`alertID`] = result.alertID;
        this.alert[`alertName`] = result.alertName;
        this.alert[`alertType`] = result.alertType;
        this.alert[`assets`] = result.assets;
        this.alert[`vehicles`] = result.vehicles;
        this.alert[`drivers`] = result.drivers;
        this.alert[`groups`] = result.groups;
        this.alert[`users`] = result.users;
        this.otherEmails = result.otherEmails.toString();
      });
    this.spinner.hide();
  }

  updateAlert() {
    if(this.otherEmails){
      this.alert.otherEmails = this.otherEmails.split(',');  
    }     
    // if (this.fileName === '') {
    //   this.imageError = 'Please Choose Image To Upload';
    //   return;
    // }
    this.hideErrors(); 
    this.apiService.putData('alerts/', this.alert).subscribe({
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
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.toastr.success('Alert Updated successfully');
        this.router.navigateByUrl('/alert-list');
      },
    });
  }
}
