import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-remind-detail',
  templateUrl: './service-remind-detail.component.html',
  styleUrls: ['./service-remind-detail.component.css']
})
export class ServiceRemindDetailComponent implements OnInit {
  reminderID;
  public reminderData: any = [];
  vehicles = [];
  vehicleIdentification = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.reminderID = this.route.snapshot.params['reminderID']; // get reminderID from URL

    this.fetchReminder();
  }

  /**
   * fetch Reminder data
   */
  fetchReminder() {
    this.apiService
      .getData(`serviceReminder/${this.reminderID}`)
      .subscribe((result: any) => {
        if (result) {
          this.reminderData = result['Items'];
          console.log('reminderData', this.reminderData);
          this.fetchVehicles(this.reminderData[0].vehicleID);
        }
      }, (err) => {
        console.log('reminder detail', err);
      });
  }
  fetchVehicles(ID) {
    this.apiService.getData('vehicles/' + ID).subscribe((result: any) => {
      this.vehicles = result.Items;
     // console.log('VEHICLES', this.vehicles);
      this.vehicleIdentification =  this.vehicles[0].vehicleIdentification;
     // console.log('vehicleId' , this.vehicleIdentification);
    });
  }
  deleteReminder(entryID) {
    this.apiService
      .deleteData('serviceReminder/' + entryID)
      .subscribe((result: any) => {
        this.toastr.success('Service Reminder Deleted Successfully!');
        this.router.navigateByUrl('/fleet/reminders/service-reminder/list');
      });
  }
}
