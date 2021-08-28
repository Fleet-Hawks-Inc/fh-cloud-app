import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
declare var L: any;

@Injectable({
  providedIn: 'root'
})
export class LeafletMapService {
  public map;
  constructor() { }

  /**
   * Initialize Leaflet map for addGeofencing Page
   */
  initGeoFenceMap = () => {

    const here = {
      apiKey: environment.mapConfig.apiKey
    };
    const style = 'normal.day';

    const hereTileUrl = `https://2.base.maps.ls.hereapi.com/maptile/2.1/trucktile/newest/${style}/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320&congestion=true`;
    // const hereTileUrl = `https://1.aerial.maps.api.here.com/maptile/2.1/maptile/hybrid.day/7/22/43/512/png8?apiKey=${here.apiKey}`;
    const map = L.map('map', {
      center: [51.058372, -114.032933],
      zoom: 18,
      // layers: [L.tileLayer(hereTileUrl)]
    });
    L.tileLayer.provider('HEREv3.satelliteDay', {
        apiKey: here.apiKey
    }).addTo(map);
    // L.marker([37.773972, -122.431297]).addTo(map);

    map.attributionControl.addAttribution('&copy; HERE 2020');
    // map.pm.addControls({
    //   position: 'topleft',
    //   drawCircle: false,
    //   drawCircleMarker: false,
    //   drawPolyline: false,
    //   drawRectangle: false,
    //   drawPolygon: true,
    //   editMode: true,
    //   dragMode: true,
    //   cutPolygon: true,
    //   removalMode: true,
    //   drawMarker: false
    // });
    // map.on('pm:create', (e) => {
    //   // alert('pm:create event fired. See console for details');
    //   const layer = e.layer;

    
    //   var polyedit = layer.toGeoJSON();
    //   this.geofenceData.geofence.type = polyedit.geometry.type;
    //   this.geofenceData.geofence.cords = polyedit.geometry.coordinates;

    

    //   layer.on('pm:edit', ({ layer }) => {

    //     var polyedit = layer.toGeoJSON();
    //     this.geofenceData.geofence.type = polyedit.geometry.type;
    //     this.geofenceData.geofence.cords = polyedit.geometry.coordinates;

    

    //   })


    // });

    // map.on('pm:cut', function (e) {
    
    // });
    // map.on('pm:remove', function (e) {
    
    // });

    this.map = map;
    return map;


  }
}
