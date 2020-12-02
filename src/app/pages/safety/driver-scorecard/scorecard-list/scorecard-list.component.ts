import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import * as moment from "moment";

@Component({
  selector: 'app-scorecard-list',
  templateUrl: './scorecard-list.component.html',
  styleUrls: ['./scorecard-list.component.css']
})
export class ScorecardListComponent implements OnInit {

  drivers = [];
  eventData = [];
  constructor(private apiService: ApiService, private awsUS: AwsUploadService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit() {
    this.fetchDrivers();
  }

  fetchDrivers() {
    this.apiService.getData('drivers')
      .subscribe((result: any) => {
        result.Items.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });
        console.log('this.drivers')
        console.log(result.Items)
        for (let i = 0; i < result.Items.length; i++) {
          const element = result.Items[i];
          if (element.isDeleted === 0) {
            let obj = {
              driverName: element.fullName,
              driverID: element.driverID,
              compliance: 'NA',
              safetyScore: 'NA',
              fuelIdling: 'NA',
              harshBrake: 0,
              harshAcceleration: 0,
              harshTurn: 0,
              rollingStop: 0,
              crashes: 0,
              overSpeeding: 0,
              distance: 0,
              time: <any>'00:00:00',
              rank: 0
            }
            let eventtim = <any>'00:00:00';
            this.apiService.getData('safety/eventLogs/fetch/driver/eventData/' + element.userName)
              .subscribe((result1: any) => {
                for (let j = 0; j < result1.Items.length; j++) {
                  const element1 = result1.Items[j];
                  if (element1.criticalityType === 'harshAcceleration') {
                    obj.harshAcceleration = obj.harshAcceleration + 1;
                  }

                  if (element1.criticalityType === 'harshBrake') {
                    obj.harshBrake = obj.harshBrake + 1;
                  }

                  if (element1.criticalityType === 'harshTurn') {
                    obj.harshTurn = obj.harshTurn + 1;
                  }

                  if (element1.criticalityType === 'rollingStop') {
                    obj.rollingStop = obj.rollingStop + 1;
                  }

                  if (element1.criticalityType === 'crashes') {
                    obj.crashes = obj.crashes + 1;
                  }

                  if (element1.criticalityType === 'overSpeedingStart' || element1.criticalityType === 'overSpeedingEnd') {
                    if (element1.criticalityType === 'overSpeedingStart') {
                      obj.overSpeeding = obj.overSpeeding + 1;
                    }

                    obj.distance = obj.distance + parseFloat(element1.odometerReading);
                    //subtract end time from start time
                    var d = moment.duration(element1.evenEndTime).subtract(moment.duration(element1.eventStartTime))
                    let newTime = moment.utc(d.as('milliseconds')).format("HH:mm:ss")

                    //add total time of overspeeding i.e of criticality type overspeedingstart and end
                    eventtim = moment.duration(eventtim).add(moment.duration(newTime));
                    eventtim = moment.utc(eventtim.as('milliseconds')).format("HH:mm:ss");
                    obj.time = eventtim;
                  }
                }
                obj.rank = obj.harshAcceleration + obj.harshBrake + obj.rollingStop + obj.crashes + obj.overSpeeding;
                this.eventData.push(obj);
                this.eventData.sort(function(a, b) {
                  return b.rank - a.rank;
                });
              })
          }
        }
      })
  }

}
