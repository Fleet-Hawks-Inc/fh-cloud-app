import { Injectable,ViewChild, Input, ElementRef } from '@angular/core';
import { environment } from './../../environments/environment'
import { Observable, of, empty} from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
declare var H: any;
declare var L: any;

@Injectable({
  providedIn: 'root'
})
export class HereMapService {
  
  public start: any;

  private platform: any;
  private map: any;
  private ui: any;
  private readonly apiKey = environment.mapConfig.apiKey;

  public searchResults: any;
  
  constructor(private http: HttpClient) { }

  /**
   * Initialize maps
   */
  mapInit11 = () => {
    
    this.platform = new H.service.Platform({
      'apikey': this.apiKey,
    });
    const defaultLayers = this.platform.createDefaultLayers();
    this.map = new H.Map(
      document.getElementById('map'),
      defaultLayers.vector.normal.truck,
      {
        zoom: 13.2,
        //center: { lat: lat, lng: lng },
        pixelRatio: window.devicePixelRatio || 1

      }
    );
    const mapTileService = this.platform.getMapTileService({
      type: 'base'
    });
    const parameters = {
      congestion: true,
      ppi: 320

    };
    // possible value  'normal.day', and 'normal.night'
    const tileLayer = mapTileService.createTileLayer(
      'trucktile',
      'normal.night',
      256,
      'png',

      parameters
    );
    
    // This display the current traffic detail -> Green Means Free, Yellow means Moderate Congestion
    // Red means High Congestion
    this.map.addLayer(defaultLayers.vector.normal.traffic);
    this.map.addLayer(tileLayer);

    // This display the traffic incidents - by default its updated in every 3 mins
    this.map.addLayer(defaultLayers.vector.normal.trafficincidents);
    this.map.setBaseLayer(tileLayer);

    this.getCurrentLocation();
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
    let mapSettings = this.ui.getControl('mapsettings');
    let zoom = this.ui.getControl('zoom');
    let scalebar = this.ui.getControl('scalebar');

    mapSettings.setAlignment('bottom-left');
    zoom.setAlignment('bottom-left');
    scalebar.setAlignment('bottom-left');

  }
  mapInit = () => {

    const here = {
      apiKey: environment.mapConfig.apiKey
    }
    const style = 'normal.night';
	const parameters = {
		congestion: true,
		ppi: 320

	};
    const hereTileUrl = `https://2.base.maps.ls.hereapi.com/maptile/2.1/trucktile/newest/${style}/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320&congestion=true`;
    const map = L.map('map', {
      	center: [37.773972, -122.431297],
      	zoom: 17,
      	layers: [L.tileLayer(hereTileUrl)]
	});
	
    //map.attributionControl.addAttribution('&copy; HERE 2020');
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
			//var polyedit = layer.toGeoJSON();
			console.log(coords);
			//console.log(polyedit);
	});
	map.on('pm:edit',(e) => {
		const layer = e.layer
		console.log("lyr", layer)
		var coords = layer.getLatLngs();
		var polyedit = layer.toGeoJSON();
		console.log(coords);
		console.log(polyedit);
	  })
	map.on('pm:cut', function (e) {
		  console.log('cut event on map');
		  console.log(e);
	});
	map.on('pm:remove', function (e) {
		  console.log('pm:remove event fired.');
		  // alert('pm:remove event fired. See console for details');
		  console.log(e);
	});
	



    //this.getCurrentLocation();


  }

 

  /**
   * This method get current location of user. Currently it is using browsser navigater to get location
   * TODO: Get Current location form GPS device
   */
  getCurrentLocation() {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.start = position.coords.latitude + ',' + position.coords.longitude;
        this.map.setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });


        const currentLoc = new H.map.Marker({ lat: position.coords.latitude, lng: position.coords.longitude });
        this.map.removeObjects(this.map.getObjects());
        this.map.addObject(currentLoc);

      });
    }
  }

  searchLocation(query): Observable<any> {
    const URL = 'https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json';
    return this.http.get(URL + '?apiKey=' + this.apiKey + '&query=' + query)
      .pipe(map(response => {
        return this.searchResults = response['suggestions'];
      })
      );
    
  }

  // returns the response
  public searchEntries(query) {
    return this.searchLocation(query);
  }
}
