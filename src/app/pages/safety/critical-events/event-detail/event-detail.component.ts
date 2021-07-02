import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { HereMapService } from '../../../../services/here-map.service';
import * as moment from 'moment';
import { SafetyService } from 'src/app/services/safety.service';
declare var H: any;

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

  ngOnInit() {
    this.platform=this.hereMap.mapSetAPI();
    this.map = this.hereMap.mapInit();
    this.eventID = this.route.snapshot.params['eventID'];
    this.fetchEventDetail();
    this.mapShow();
  }

  async fetchEventDetail() {
    this.safetyService.getData('critical-events/' + this.eventID)
      .subscribe(async (res: any) => {
        
        let result = res[0];
        this.driver = result.driverUsername;
        this.vehicle = result.vehicleID;
        this.eventDate = result.eventDate;
        this.eventSource = result.eventSource;
        this.eventTime =  result.eventTime;;
        
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
        console.log('this.eventImages', this.eventImages);
        console.log('this.eventVideos', this.eventVideos);
        // this.fetchDriverDetail(this.driver)
      })
  }
  
  mapShow() {
    
    setTimeout(() => {
      this.hereMap.mapSetAPI();
      this.hereMap.mapInit();
    }, 100);
  }


  setMarker = async (value: any) => {
    
    const service = this.platform.getSearchService();
    const result = await service.geocode({ q: value });
    
    const positionFound = result.items[0].position;
    this.map.setCenter({
      lat: positionFound.lat,
      lng: positionFound.lng
    });
    const currentLoc = new H.map.Marker({ lat: positionFound.lat, lng: positionFound.lng });
    this.map.addObject(currentLoc);
    
  }


  async fetchDriverDetail(driverUserName) {
    let result = await this.apiService.getData('drivers/userName/' + driverUserName).toPromise();
      // .subscribe((result: any) => {
        
        if (result.Items[0].firstName != undefined) {
          return result.Items[0].firstName + ' ' + result.Items[0].lastName;
        }
      // })
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
