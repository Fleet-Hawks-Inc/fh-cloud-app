import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
declare var L: any;

@Injectable({
  providedIn: 'root'
})
export class LeafletMapService {
  public map;
  public polygonData: any;
  
  constructor() { }

  
  /**
   * Initialize Leaflet map for addGeofencing Page
   */
  initGeoFenceMap = () => {

    const here = {
      apiKey: environment.mapConfig.apiKey
    }
    const style = 'normal.night';
	  
    const hereTileUrl = `https://2.base.maps.ls.hereapi.com/maptile/2.1/trucktile/newest/${style}/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320&congestion=true`;
    
    const map = L.map('map', {
      	center: [37.773972, -122.431297],
      	zoom: 17,
      	layers: [L.tileLayer(hereTileUrl)]
	  });
    
    map.attributionControl.addAttribution('&copy; HERE 2020');
    map.pm.addControls({
      position: 'topleft',
      drawCircle: true,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawPolygon: true,
      editMode: true,
      dragMode: true,
      cutPolygon: true,
      removalMode: true,
      drawMarker: false
    });
	  map.on('pm:create', function (e) {
		  // alert('pm:create event fired. See console for details');
		  const layer = e.layer;
			
			console.log("lyr", layer)
      var coords = layer.getLatLngs();
      this.polygonData = coords;
			//var polyedit = layer.toGeoJSON();
			console.log(coords);
      //console.log(polyedit);
      layer.on('pm:edit',({layer}) => {
        console.log("lyr", layer)
        var coords = layer.getLatLngs();
        var polyedit = layer.toGeoJSON();
        this.polygonData = coords;
        console.log("dd",this.polygonData);
        console.log("ddd",polyedit);
      })
      return this.polygonData;
	});
	
	map.on('pm:cut', function (e) {
		  console.log('cut event on map');
		  console.log(e);
	});
	map.on('pm:remove', function (e) {
		  console.log('pm:remove event fired.');
		  // alert('pm:remove event fired. See console for details');
		  console.log(e);
  });
  
  
  var searchControl = L.esri.Geocoding.geosearch().addTo(map);

  var results = L.layerGroup().addTo(map);

  searchControl.on('results', function (data) {
    console.log("data",data);
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
      results.addLayer(L.marker(data.results[i].latlng));
    }
  });
	
}


}
