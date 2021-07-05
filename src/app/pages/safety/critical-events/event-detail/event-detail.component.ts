import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { HereMapService } from '../../../../services/here-map.service';
import * as moment from 'moment';
import { SafetyService } from 'src/app/services/safety.service';
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
    driverUsername: '',
    driverName: '',
    criticalityType: '-',
  };

  public eventImages = [];
  public eventVideos = [];

  driver: string;
  vehicle: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  location: string;
  createdBy: string;
  eventSource: string;

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
    autoplay: true,
    autoplaySpeed: 1500,
  };  


  vehiclesObject: any = {};
  driversObject: any = {};

  ngOnInit() {
    this.platform=this.hereMap.mapSetAPI();
    this.map = this.hereMap.mapInit();
    this.eventID = this.route.snapshot.params['eventID'];
    this.fetchEventDetail();
    this.fetchAllDriverIDs();
    this.fetchAllVehiclesIDs();
    this.mapShow();
  }

  async fetchEventDetail() {
    this.safetyService.getData('critical-events/' + this.eventID)
      .subscribe(async (res: any) => {
        
        let result = res[0];
        this.driver = result.driverID;
        this.vehicle = result.vehicleID;
        this.eventDate = result.eventDate;
        this.eventSource = result.eventSource;
        this.eventTime =  await this.convertTimeFormat(result.eventTime);
        
        this.eventType = result.eventType;
        this.location = result.location;
        await this.setMarker(this.location);
        
        if(result.uploadedPhotos != undefined && result.uploadedPhotos.length > 0){
          this.eventImages = result.uploadedPhotos.map(x => ({
            path: `${this.asseturl}/${result.pk}/${x}`,
            name: x,
          }));
        }

        if(result.uploadedVideos != undefined && result.uploadedVideos.length > 0){
          this.eventVideos = result.uploadedVideos.map(x => ({path: `${this.asseturl}/${result.pk}/${x}`, name: x}));
        }
        
        this.createdBy = result.createdBy;
        this.safetyNotes = result.safetyNotes;
        
      })
  }
  
  convertTimeFormat (time: any) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }

  mapShow() {
    
    setTimeout(() => {
      this.hereMap.mapSetAPI();
      this.hereMap.mapInit();
    }, 100);
  }

  slickInit(event) {
    console.log('event', event);
  }

  setMarker = async (value: any) => {
    
    const service = this.platform.getSearchService();
    const result = await service.geocode({ q: value });
    
    const positionFound = result.items[0].position;
    const startIcon=new H.map.Icon("/assets/img/mapIcon/dest.png",{ size: { w: 30, h: 30 } })
    this.map.setCenter({
      lat: positionFound.lat,
      lng: positionFound.lng
    });
    const currentLoc = new H.map.Marker({ lat: positionFound.lat, lng: positionFound.lng }, { icon: startIcon });
    this.map.addObject(currentLoc);
    
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
    let data = {
        notes: this.newNotes,
        eventID: this.eventID,
    }
    
    this.safetyService.postData('critical-events/notes', data).subscribe(res => {
      this.fetchEventDetail();
      this.toastr.success('Notes added successfully!');
      this.newNotes = '';
    });
  }
}
