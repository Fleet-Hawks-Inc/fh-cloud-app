import { Injectable,ViewChild, Input, ElementRef } from '@angular/core';
import { environment } from './../../environments/environment';
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
  private httpOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
    };
    return httpOptions;
  }
  constructor(private http: HttpClient) { }

  /**
   * Initialize maps
   */
  mapInit = () => {
    
    this.platform = new H.service.Platform({
      'apikey': this.apiKey,
    });
    const defaultLayers = this.platform.createDefaultLayers();
    this.map = new H.Map(
      document.getElementById('map'),
      defaultLayers.vector.normal.truck,
      {
        zoom: 13,
        center: { lat: 51.053193, lng: -114.067266 },
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

    //this.getCurrentLocation();
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
    let mapSettings = this.ui.getControl('mapsettings');
    let zoom = this.ui.getControl('zoom');
    let scalebar = this.ui.getControl('scalebar');

    mapSettings.setAlignment('bottom-left');
    zoom.setAlignment('bottom-left');
    scalebar.setAlignment('bottom-left');
     return this.map;
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
/*
  AutoSuggest Search Api v6
*/ 
  searchLocationOld(query): Observable<any> {
    const URL = 'https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json';
    return this.http.get(URL + '?apiKey=' + this.apiKey + '&query=' + query  )
      .pipe(map(response => {
        console.log("response['suggestions']", response['suggestions']);
        return this.searchResults = response['suggestions'];
      })
      );
  }
  
  /*
  AutoSuggest Search Api v7
*/ 
  searchLocation = async (query) => {
    this.platform = new H.service.Platform({
      'apikey': this.apiKey,
    });
    if(query != ''){
      const service = this.platform.getSearchService();
      const result = await service.geocode({ q: query });
      if (result && result.items.length > 0) {
        console.log(result);
        const response = await service.autosuggest(
          {
            at: `${result.items[0].position.lat},${result.items[0].position.lng}`,
            limit: 5,
            q: query
          }
        );
        return response.items
      }
    }
    
  }
  

  // returns the response
  public searchEntries(query) {
    return this.searchLocation(query);
  }
}
