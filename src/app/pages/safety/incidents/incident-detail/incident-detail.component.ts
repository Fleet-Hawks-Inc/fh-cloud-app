import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { HereMapService } from '../../../../services/here-map.service';
import { SafetyService } from 'src/app/services/safety.service';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
declare var H: any;
declare var $: any;
@Component({
  selector: 'app-incident-detail',
  templateUrl: './incident-detail.component.html',
  styleUrls: ['./incident-detail.component.css']
})
export class IncidentDetailComponent implements OnInit {
  asseturl = this.apiService.AssetUrl;
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');

  private platform: any;
  public map;

  constructor(private apiService: ApiService,  private domSanitizer: DomSanitizer, private safetyService: SafetyService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private router: Router, private route: ActivatedRoute, private hereMap: HereMapService) {
  }

  errors = {};
  driver: string;
  vehicle: string;
  eventDate: string;
  eventTime: string;
  trip: string;
  assigned: string;
  severity: string;
  location: string;
  incidentType: string;
  eventSource: string;

  safetyNotes = [];
  createdBy: string;

  public incidentImages = [];
  public incidentVideos = [];
  public incidentDocs = [];
  vehiclesObject: any = {};
  driversObject: any = {};
  tripsObject: any = {};

  incidentID = '';
  newNotes = '';

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    variableWidth: true,
    autoplaySpeed: 1500,
  };

  showMap: boolean = true;

  slideConfig1 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1500,
  };  

  
  ngOnInit() {
    this.incidentID = this.route.snapshot.params['incidentID'];
    this.platform=this.hereMap.mapSetAPI();
    this.map = this.hereMap.mapInit();
    this.fetchEventDetail();
    this.fetchAllVehiclesIDs();
    this.fetchAllDriverIDs();
    this.fetchTripsByIDs();
    this.mapShow();

    $('#viewDocModal').modal({
      show: false
  }).on('hidden.bs.modal', function(){
      $(this).find('video')[0].pause();
  });
  }


  async fetchEventDetail() {
    this.safetyService.getData('incidents/detail/' + this.incidentID)
      .subscribe(async (res: any) => {
        
        let result = res[0];
        this.driver = result.driverID;
        this.vehicle = result.vehicleID;
        this.trip = result.tripID;
        this.incidentType = result.incidentType;
        this.severity = result.severity;
        this.eventDate = result.eventDate;
        this.assigned = result.assigned;
        this.eventSource = result.eventSource;
        this.eventTime =  await this.convertTimeFormat(result.eventTime);
        this.location = result.location.label ? result.location.label : 'NA';
        if(result.location.cords != undefined) {
          await this.setMarker(result.location.cords);  
        }
        
        
        if(result.uploadedPhotos != undefined && result.uploadedPhotos.length > 0){
        this.incidentImages = result.uploadPics;
         // this.incidentImages = result.uploadedPhotos.map(x => ({
         //    path: `${this.asseturl}/${result.pk}/${x}`,
        //    name: x,
        //  }));
        }
        if(result.uploadedVideos != undefined && result.uploadedVideos.length > 0){
        this.incidentVideos = result.uploadVideo;
         // this.incidentVideos = result.uploadedVideos.map(x => ({path: `${this.asseturl}/${result.pk}/${x}`, name: x}));
        }
        if(result.uploadedDocs != undefined && result.uploadedDocs.length > 0){
        this.incidentDocs = result.uploadDocument;
          //this.incidentDocs = result.uploadedDocs.map(x => ({path: `${this.asseturl}/${result.pk}/${x}`, name: x}));
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

  mapShow() {
    
    setTimeout(() => {
      this.hereMap.mapSetAPI();
      this.hereMap.mapInit();
    }, 100);
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
    if(this.newNotes.trim().length > 0) {
      let data = {
          notes: this.newNotes,
          incidentID: this.incidentID,
      }
      
      this.safetyService.postData('incidents/notes', data).subscribe(res => {
        this.fetchEventDetail();
        this.toastr.success('Notes added successfully');
        this.newNotes = '';
      });
    }
    
  }

  fetchTripsByIDs() {
    this.apiService.getData('trips/get/list')
      .subscribe((result: any) => {
        this.tripsObject = result;
      })
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length-1];
    this.pdfSrc = '';
    if(ext == 'doc' || ext == 'docx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

}
