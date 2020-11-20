import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var H: any;

@Injectable({
  providedIn: 'root'
})
export class HereMapService {

  public start: any;

  public origin: any = '50.458573,-104.639188';
  public destination: any = '51.056646,-114.144170';

  driveModes: string;
  totalWayPoints = new Array<any>();

  public totalDistance: any = '00';
  public totalTime: any = '00';

  newStartMarker: any;
  viaPoints = new Array<any>();

  private platform: any;
  private router: any;

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
        zoom: 5,
        center: {lat: 45.8598584, lng: -94.526364},
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

    // this.getCurrentLocation();
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
    if (query !== '') {
      const service = this.platform.getSearchService();
      const response = await service.autosuggest(
        {
          at: `51.271096,-114.275941`,
          limit: 5,
          q: query,
          lang: 'en',
        }
      );
      return response.items;
    }
    // if (query !== '') {
    //   const service = this.platform.getSearchService();
    //   const result = await service.geocode({ q: query });
    //   if (result && result.items.length > 0) {
    //     const response = await service.autosuggest(
    //       {
    //         at: `51.271096,-114.275941`,
    //         limit: 5,
    //         q: query,
    //         lang: 'en',
    //       }
    //     );
    //     return response.items;
    //   }
    // }
  }
  // returns the response
  public searchEntries(query) {
    return this.searchLocation(query);
  }

  getRoutingParameters() {
    const driveMode = this.driveModes || 'fastest'; // Default is fastest other option is short
    const alternatives = 3;
    // Reading it from Settings table

    const parameters = {
      mode: `${driveMode};truck`,
      waypoint0: 'geo!' + this.origin,
      waypoint1: 'geo!' + this.destination,
      representation: 'display',
      routeAttributes: 'summary',
      units: 'imperial',
      alternatives,
      tollVehicleType: 'truck',
      rollups: 'none,tollsys,country,total'
    };
    if (this.totalWayPoints.length > 0) {
      this.totalWayPoints.forEach(element => {
        let counter = 2;
        const waypointValue = `waypoint${counter}`;
        parameters[waypointValue] = element;
        counter = counter + 1;
      });
    }
    return parameters;
  }

  /**
   * Get coordinates for specified location
   * @param value location name
   */
  public async geoCode(value: any) {
    this.platform = new H.service.Platform({
      'apikey': this.apiKey,
    });
    const service = this.platform.getSearchService();
    return service.geocode({ q: value });
  }

  calculateRoute(coordinates) {
    console.log('coordinates', coordinates);
    try {
      if (coordinates.length > 2) {
        coordinates.forEach(element => {
          this.viaPoints.push(element);
        });
        this.viaPoints.shift();
        this.viaPoints.pop();
      }
      // ['51.044978,-114.063311', '51.081848,-113.925807', '51.205534,-114.001558', '51.127017,-114.008666']
      const alternatives = 3;
      const params = {
        transportMode: `truck`,
        routingMode: 'fast',
        origin: coordinates[0],
        via: new H.service.Url.MultiValueQueryParameter(this.viaPoints),
        destination: coordinates[coordinates.length - 1],
        representation: 'display',
        units: 'imperial',
        alternatives,
        return: 'polyline,actions,instructions,summary,travelSummary,turnByTurnActions,elevation,routeHandle,passthrough,incidents',
        spans: 'truckAttributes,duration,speedLimit',
      };
      this.router = this.platform.getRoutingService(null, 8);
      this.map.removeObjects(this.map.getObjects());
      const routeColors = ['#3700b3', '#03dac6', '#cf6679', '#000080', '#f5d200', '#13a2c2'];
      this.router.calculateRoute(params, route => {
        // console.log("route", route);
        if (route.routes) {
          route.routes.forEach((section, i) => {
            // console.log("section", section);
            // decode LineString from the flexible polyline
            section.sections.forEach(item => {
              // console.log("item", item);

              const linestring = H.geo.LineString.fromFlexiblePolyline(item.polyline);
              // Create a polyline to display the route:
              const polyline = new H.map.Polyline(linestring, {
                style: {
                  lineWidth: 5,
                  strokeColor: routeColors[i]
                }
              });

            //   polyline.addEventListener('tap', function(evt) {
            //     // Log 'tap' and 'mouse' events:
            //     console.log(evt.type, evt.currentPointer.type); 
            // });

              // Total Distance in KM
              this.totalDistance = item.travelSummary.length / 1000;
              const factor = 0.621371;
              this.totalDistance = this.totalDistance.toFixed(2) * factor + ' Miles';
              // console.log(this.totalDistance)
              
            //   var bubble = new H.ui.InfoBubble(item.departure.place.location, {
            //     content: `<b>${this.totalDistance}</b>`
            //  });

            //   // Add info bubble to the UI:
            //   this.ui.addBubble(bubble);
              // Total Travel Time in hours & mins
              const h = Math.floor(item.travelSummary.duration / 3600);
              const m = Math.floor(item.travelSummary.duration % 3600 / 60);
              this.totalTime = h + ' hour' + '  ' + m + ' mins';

              // let poly = H.geo.LineString.fromFlexiblePolyline(item.polyline).getLatLngAltArray();
              
              // Create a marker for the start point:
              const startMarker = new H.map.Marker(item.departure.place.location);

              // Create a marker for the end point:
              const endMarker = new H.map.Marker(item.arrival.place.location);

              // Add the route polyline and the two markers to the map:
              this.map.addObjects([polyline, startMarker, endMarker]);

              // And zoom to its bounding rectangle
              this.map.getViewModel().setLookAtData({
                bounds: polyline.getBoundingBox()
              });
            });
          });
        };
      })
  } catch (erro) {
    console.log('calculateroute', erro);
  }
  }
}
