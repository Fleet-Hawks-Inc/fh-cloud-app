import { Component, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';
import {MAPSTYLES} from './map.styles';
import { of} from 'rxjs';
import {tap} from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';
declare var $: any;

@Component({
  selector: 'app-map-dashboard',
  templateUrl: './map-dashboard.component.html',
  styleUrls: ['./map-dashboard.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('2000ms', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('2000ms', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ],
})
export class MapDashboardComponent implements OnInit {

  title = 'Map Dashboard';
  mapProp;
  visible = true;


  @ViewChild('gmap' , { static: true }) gmapElement: any;
  map: google.maps.Map;

  markers = of(
    {lat: 30.934050, lng: 75.810590},
    {lat: 30.938620, lng: 75.816780},
    {lat: 30.9496591, lng: 75.8212431}
  );

  center = {lat: 30.900965 , lng: 75.857277};
  marker ;
  constructor() { }

  ngOnInit() {
    this.initMap();

    // $(document).ready(() => {
    //     const timeToSlide = 0.5;
    //     $('#arrowR').on('click', () => {
    //     $('#driverList').hide('slide', {direction: 'right'}, (timeToSlide * 1000));
    //     $('#arrowR').hide();
    //     $('#arrowL').show(); });
    //     $('#arrowL').on('click', () => {
    //     $('#driverList').show('slide', {direction: 'right'}, (timeToSlide * 1000));
    //     setTimeout(() => {
    //     $('#arrowR').show();
    //     $('#arrowL').hide();
    //     }, (timeToSlide * 1000));
    //   });
    // });



  }


  valuechange() {
    this.visible = !this.visible;
  }

  initMap() {
     this.mapProp = {
      center: new google.maps.LatLng(this.center),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: MAPSTYLES
    };

     this.map = new google.maps.Map(this.gmapElement.nativeElement, this.mapProp);


     this.markers
       .pipe(tap((v) => {
         this.marker = new google.maps.Marker({
             position: new google.maps.LatLng(v.lat, v.lng),
             map: this.map
           });
           }
         ))
       .subscribe((val) => console.log(val));




  }



}
