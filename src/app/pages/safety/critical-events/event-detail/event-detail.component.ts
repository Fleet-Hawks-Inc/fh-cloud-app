import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { HereMapService } from '../../../../services/here-map.service';
import { SafetyService } from 'src/app/services/safety.service';
import spacetime from 'spacetime';
declare var H: any;
declare var $: any;

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  asseturl = this.apiService.AssetUrl;

  constructor(private apiService: ApiService, private safetyService: SafetyService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private router: Router, private route: ActivatedRoute, private hereMap: HereMapService) {
  }

  private platform: any;
  public map;

  errors = {};
  event = {
    eventDate: '',
    eventTime: '',
    location: '',
    criticalityType: '-',
  };

  public eventImages = [];
  public eventVideos = [];

  deviceSerialNo: string;
  vehicle: string;
  trip: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  location: string;
  createdBy: string;
  eventSource: string;
  assigned: string;
  deviceEventId: string;
  eventStartDateTime: string;
  eventEndDateTime: string

  eventID = '';
  safetyNotes = [];
  newNotes: string;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    variableWidth: true,
    autoplaySpeed: 1500,
  };

  slideConfig1 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: false,
    variableWidth: true,
    autoplaySpeed: 1500,
  };


  vehiclesObject: any = {};
  driversObject: any = {};

  ngOnInit() {
    this.platform = this.hereMap.mapSetAPI();
    this.map = this.hereMap.mapInit();
    this.eventID = this.route.snapshot.params['eventID'];
    this.fetchEventDetail();
    this.fetchAllDriverIDs();
    this.fetchAllVehiclesIDs();
    this.mapShow();
  }

  async fetchEventDetail() {
    this.safetyService.getData('critical-events/detail/' + this.eventID)
      .subscribe(async (res: any) => {

        let result = res[0];
        this.deviceSerialNo = result.deviceSerialNo || 'NA';
        this.vehicle = result.vehicleID;
        this.trip = result.tripID;
        this.assigned = result.assigned;
        this.eventDate = result.eventDate;
        this.eventSource = result.eventSource;
        this.eventTime = await this.convertTimeFormat(result.eventTime);
        this.createdBy = result.createdBy;
        this.eventType = result.eventType;
        this.deviceEventId = result.deviceEventId;
        const location = await this.getLocation(result.location);
        this.location = location;
        await this.setMarker(result.location);
        this.safetyNotes = result.safetyNotes;
        if (result.uploadedPhotos != undefined && result.uploadedPhotos.length > 0) {
          this.eventImages = result.uploadedPhotos.map(x => ({
            path: `${this.asseturl}/${result.pk}/${x}`,
            name: x,
          }));
        }

        if (result.uploadedVideos != undefined && result.uploadedVideos.length > 0) {
          this.eventVideos = result.uploadedVideos.map(x => ({
            path: `${this.asseturl}/${result.pk}/${x}`,
            name: x
          }));
        }



      })
  }


  convertTimeFormat(time: any) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }

  mapShow() {

    setTimeout(() => {
      this.hereMap.mapSetAPI();
      this.hereMap.mapInit();
    }, 100);
  }

  async getLocation(location: string) {
    try {
      const cords = location.split(',');
      if (cords.length == 2) {
        const params = {
          lat: cords[0].trim(),
          lng: cords[1].trim()

        }
        const location = await this.hereMap.revGeoCode(params);

        if (location && location.items.length > 0) {
          return location.items[0].title;
        } else {
          return 'NA';
        }
      } else {
        return 'NA';
      }
    } catch (error) {
      return 'NA';
    }

  }

  setMarker = async (location: any) => {
    const cords = location.split(',');
    if (cords.length > 0) {
      const lat = cords[0];
      const lng = cords[1];
      const startIcon = new H.map.Icon("/assets/img/mapIcon/dest.png", { size: { w: 30, h: 30 } })
      this.map.setCenter({
        lat,
        lng
      });
      const currentLoc = new H.map.Marker({ lat, lng }, { icon: startIcon });
      this.map.addObject(currentLoc);
    }

  }

  fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/get/list')
      .subscribe((result: any) => {
        this.vehiclesObject = result;
      });
  }

  fetchAllDriverIDs() {
    this.apiService.getData('drivers/get/list')
      .subscribe((result: any) => {
        this.driversObject = result;
      });
  }


  addNotes() {
    if (this.newNotes.trim().length > 0) {
      let data = {
        notes: this.newNotes,
        eventID: this.eventID,
      }

      this.safetyService.postData('critical-events/notes', data).subscribe(res => {
        this.fetchEventDetail();
        this.toastr.success('Notes added successfully');
        this.newNotes = '';
      });
    }

  }

  /**
   * Fetch Event Evidence only in case of Automatic events generated by DashCam
   */
  async fetchEvidence() {

    try {
      const eventStartDate = spacetime(this.eventStartDateTime).format('numeric-cn');
      const eventEndDate = spacetime(this.eventEndDateTime).format('numeric-cn');
      const body = {
        deviceSerialNo: this.deviceSerialNo,
        startDateTime: `${eventStartDate} 00:00:00`,
        endDateTime: `${eventEndDate} 23:59:59`,
        deviceEventId: this.deviceEventId
      }
      const response: any = await this.safetyService.postData('critical-events/fetchEvent', body).toPromise()
      console.log(response)
      if (response && response.alarmFiles && response.alarmFiles.length > 0) {
        console.log(response.alarmFiles);
        for (const video of response.alarmFiles) {
          const params = {
            path: video.videoUrl,
            name: video.alarmType

          }
          this.eventVideos.push(params)
        }
        console.log(this.eventVideos);

      } else {
        this.toastr.error('Event Video not available. Please try again.')
      }
    } catch (error) {

      this.toastr.error('Unable to fetch evidence.')
    }

  }

}
