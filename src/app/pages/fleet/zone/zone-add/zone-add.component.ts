import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import {  ToastrService } from "ngx-toastr";
declare var $;
@Component({
  selector: 'app-zone-add',
  templateUrl: './zone-add.component.html',
  styleUrls: ['./zone-add.component.css']
})
export class ZoneAddComponent implements OnInit {

  constructor(private apiService:ApiService,private toastr:ToastrService) { }

  public zone={
    zName:null,
    zDesc:null,
    coordinates:[]
  }
  public saveDisabled=false;

  ngOnInit(): void {
    this.initMap();
    
  }

  initMap(){
    const map=new google.maps.Map(document.getElementById("map") as HTMLElement,
    {
      center:{lat:-34.397, lng: 150.644},
      zoom:8
    })
    const drawingManager=new google.maps.drawing.DrawingManager({
      drawingMode:google.maps.drawing.OverlayType.MARKER,
      drawingControl:true,
      drawingControlOptions:{
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes:[
          google.maps.drawing.OverlayType.POLYGON,

        ]
      },
      markerOptions:{
        icon:"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
      },
      circleOptions: {
        fillColor: "#ffff00",
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    });
    drawingManager.setMap(map);
    const coordinates=[]
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(polygon) {
      
      $.each(polygon.overlay.getPath().getArray(), async(key, latlng)=>{
        let coords={lat:'',lng:''}
      coords.lat = latlng.lat();
      coords.lng = latlng.lng();
      await coordinates.push(coords)
      });
      
  });
  this.zone.coordinates=coordinates
  }
  
async saveZone(){
  this.saveDisabled=true;
  console.log(this.zone.coordinates)
  if(!this.zone.zName){
    this.toastr.error("Zone Name is Required");
    return
  }
  const zoneData={
    zName:this.zone.zName,
    zDesc:this.zone.zDesc,
    coordinates:this.zone.coordinates
  }
  this.apiService.postData('zone',zoneData).subscribe({
    complete:()=>{},
    error:(err)=>{
      this.saveDisabled=false
    },
    next:(res)=>{
      this.toastr.success("Zone added successfully")
    }
  })
  }
}
