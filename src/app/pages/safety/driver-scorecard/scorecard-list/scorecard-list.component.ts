import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router} from '@angular/router';
import * as moment from "moment";

@Component({
  selector: 'app-scorecard-list',
  templateUrl: './scorecard-list.component.html',
  styleUrls: ['./scorecard-list.component.css']
})
export class ScorecardListComponent implements OnInit {

  drivers = [];
  eventData = [];
  tempEventData = [];
  filterData = {
    fromDistance: <any> '',
    toDistance: <any> '',
    driverID: '',
    driverName: ''
  }
  suggestions = [];

  constructor(private apiService: ApiService, private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.fetchDrivers();
  }

  fetchDrivers(filter='') {
    this.eventData = [];
    this.spinner.show();
    this.apiService.getData('drivers')
      .subscribe((result: any) => {
        result.Items.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });
        
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

                    if(element1.odometerReading !== undefined) {
                      obj.distance = obj.distance + parseFloat(element1.odometerReading);
                    }
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
                this.tempEventData = this.eventData;
              })
              this.spinner.hide();
          }
        }
      })
  }

  searchFilter () {
    
    if(this.filterData.driverID == '' && this.filterData.fromDistance == '' && this.filterData.toDistance == '') {
      this.toastr.error('Please select atleast one filter');
      return false;
    }

    if(this.filterData.fromDistance !== '' || this.filterData.toDistance !== '') { 
      if(this.filterData.fromDistance > this.filterData.toDistance) {
        this.toastr.error('Please enter valid from and to distance values');
        return false;
      }
    }

    this.eventData = [];
    let driversData = [];

    if(this.filterData.driverID !== '' ) {
      for (let i = 0; i < this.tempEventData.length; i++) {
        const element = this.tempEventData[i];
        if(element.driverID === this.filterData.driverID) {
          driversData.push(element);
        }
      }
    } else {
      driversData = this.tempEventData;

    }

    if(this.filterData.fromDistance !== '' && this.filterData.toDistance !== '') {
      for (let i = 0; i < driversData.length; i++) {
        const element = driversData[i];
        if(element.distance >= this.filterData.fromDistance && element.distance <= this.filterData.toDistance) {
          this.eventData.push(element);
        }
      }
    } else {
      this.eventData = driversData;
    }
    
  }

  getSuggestions(searchvalue='') {
    this.suggestions = [];
    if(searchvalue !== '') {
      this.apiService.getData('drivers/get/suggestions/'+searchvalue).subscribe({
        complete: () => {},
        error: () => { },
        next: (result: any) => {
          this.suggestions = [];
          for (let i = 0; i < result.Items.length; i++) {
            const element = result.Items[i];
  
            let obj = {
              id: element.driverID,
              name: element.firstName + ' ' + element.lastName
            };

            if(this.filterData.driverName !== '' ) {
              this.suggestions.push(obj)
            }
          }
        }
      })
    } 
  }

  searchSelectedDriver(data) {
    this.filterData.driverID = data.id;
    this.filterData.driverName = data.name;
    this.suggestions = [];
  }

  resetFilter() {
    if(this.filterData.fromDistance !== '' ||  this.filterData.toDistance !== '' ||  this.filterData.driverName !== '') {
      this.filterData = {
        fromDistance:'',
        toDistance:'',
        driverID: '',
        driverName: ''
      }
      this.suggestions = [];
      this.fetchDrivers();
    } else {
      return false;
    }
    
  }

}
