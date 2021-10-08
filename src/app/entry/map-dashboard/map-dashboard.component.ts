import { animate, style, transition, trigger } from "@angular/animations";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { HereMapService } from "../../services";
import { Subject, throwError } from "rxjs";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from "rxjs/operators";
import { ApiService } from "../../services";
declare var $: any;
declare var H: any;

@Component({
  selector: "app-map-dashboard",
  templateUrl: "./map-dashboard.component.html",
  styleUrls: ["./map-dashboard.component.css"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateX(100%)" }),
        animate("400ms", style({ transform: "translateX(0%)" })),
      ]),
      transition(":leave", [
        animate("400ms", style({ transform: "translateX(100%)" })),
      ]),
    ]),
  ],
})
export class MapDashboardComponent implements OnInit, AfterViewInit {
  environment = environment.isFeatureEnabled;
  title = "Map Dashboard";
  visible = false;

  private platform: any;
  private readonly apiKey = environment.mapConfig.apiKey;
  public map;
  public searchTerm = new Subject<string>();
  public searchResults: any;
  driverData: any;
  // Mapbox Integration
  style = "mapbox://styles/kunalfleethawks/ck86yfrzp0g3z1illpdp9hs3g";
  lat = -104.618896;
  lng = 50.44521;
  isControlAdded = false;
  frontEndData = {
    drivers: {},
  };

  center = { lat: 30.900965, lng: 75.857277 };
  marker;
  activeTrips = [];
  constructor(
    private HereMap: HereMapService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.platform = this.HereMap.mapSetAPI();
    this.map = this.HereMap.mapInit();
    this.searchLocation();
    this.showDriverData();
    this.fetchActiveTrips();

    // Entire Fleet Tree initialization
    $(function () {
      $("#treeCheckbox").jstree({
        core: {
          themes: {
            responsive: false,
          },
        },
        types: {
          default: {
            icon: "fas fa-folder",
          },
          file: {
            icon: "fas fa-file",
          },
        },
        plugins: ["types", "checkbox"],
      });
    });
  }

  userDestination = async (value: any) => {
    const service = this.platform.getSearchService();
    const result = await service.geocode({ q: value });
    const positionFound = result.items[0].position;
    this.map.setCenter({
      lat: positionFound.lat,
      lng: positionFound.lng,
    });
    const currentLoc = new H.map.Marker({
      lat: positionFound.lat,
      lng: positionFound.lng,
    });
    this.map.addObject(currentLoc);
  };

  valuechange() {
    this.visible = !this.visible;
  }
  public searchLocation() {
    this.searchTerm
      .pipe(
        map((e: any) => {
          return e.target.value;
        }),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term) => {
          return this.HereMap.searchEntries(term);
        }),
        catchError((e) => {
          return throwError(e);
        })
      )
      .subscribe((res) => {
        this.searchResults = res;
        // if (target.target.id === 'sourceLocation') {
        //   this.showSource = true;
        // }
      });
  }

  showDriverData() {
    const mockData = this.getDriverData();
    const geocoder = this.platform.getGeocodingService();
    this.frontEndData = mockData;

    mockData.drivers.forEach(async (driver) => {
      const result = await geocoder.reverseGeocode({
        prox: `${driver.location[0]},${driver.location[1]}`,
        mode: "retrieveAddresses",
        maxresults: "1",
      });
      const origin = location.origin;
      const customMarker = origin + "/assets/img/cirlce-stroke.png";
      const customIcon = new H.map.Icon(customMarker, {
        size: { w: 25, h: 25 },
      });
      const markers = new H.map.Marker(
        {
          lat: driver.location[0],
          lng: driver.location[1],
        },
        {
          icon: customIcon,
        }
      );
      // this.map.addObject(markers);
      // const defaultLayers = this.platform.createDefaultLayers();
      // const ui = H.ui.UI.createDefault(this.map, defaultLayers);
      markers.setData(`<h5>${driver.driverName}</h5>
      Load: ${driver.loadCapacity}</br>
      Speed: ${driver.speed}<br>
      Location: ${result.Response.View[0].Result[0].Location.Address.Label}
      `);
      markers.addEventListener(
        "tap",
        (evt) => {
          const bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
            // read custom data
            content: evt.target.getData(),
          });

          // show info bubble
          this.HereMap.ui.addBubble(bubble);
        },
        false
      );
    });
    // this.HereMap.calculateRoute(['51.06739365305408,-114.08167471488684', '50.469846991997564,-104.61146016696867'])
  }

  /** MOCK DATA:  This data will be from service */
  getDriverData() {
    const mockData = {
      drivers: [
        {
          driverName: "Luca Steele",
          driverStatus: "ON",
          drivingCycle: "10D",
          vehicle: "F 3650",
          trailer: "2356",
          scheduleStatus: "on Time",
          dispatchId: "DIS-6140",
          loadCapacity: "1001 tonnes",
          speed: "50 mile/hr",
          location: [51.055783, -114.068639],
          temprature: {
            setTemperature: "15",
            actualTemperature: "14",
          },
          referTemprature: {
            refeer1: "14",
            refeer2: "15",
            refeer3: "16",
          },
        },
        {
          driverName: "Maariya Holloway",
          driverStatus: "ON",
          drivingCycle: "10D",
          vehicle: "F 3650",
          trailer: "2356",
          scheduleStatus: "on Time",
          dispatchId: "DIS-6140",
          loadCapacity: "1001 tonnes",
          speed: "50 mile/hr",
          location: [51.052058, -114.071666],
          temprature: {
            setTemperature: "15",
            actualTemperature: "14",
          },
          referTemprature: {
            refeer1: "14",
            refeer2: "15",
            refeer3: "16",
          },
        },
        {
          driverName: "Regina Cole",
          driverStatus: "ON",
          drivingCycle: "10D",
          vehicle: "F 3650",
          trailer: "2356",
          scheduleStatus: "on Time",
          dispatchId: "DIS-6140",
          loadCapacity: "1001 tonnes",
          speed: "50 mile/hr",
          location: [51.042866, -114.098134],
          temprature: {
            setTemperature: "15",
            actualTemperature: "14",
          },
          referTemprature: {
            refeer1: "14",
            refeer2: "15",
            refeer3: "16",
          },
        },
        {
          driverName: "Luisa Leech",
          driverStatus: "ON",
          drivingCycle: "10D",
          vehicle: "F 3650",
          trailer: "2356",
          scheduleStatus: "on Time",
          dispatchId: "DIS-6140",
          loadCapacity: "1001 tonnes",
          speed: "50 mile/hr",
          location: [51.04283, -114.143733],
          temprature: {
            setTemperature: "15",
            actualTemperature: "14",
          },
          referTemprature: {
            refeer1: "14",
            refeer2: "15",
            refeer3: "16",
          },
        },
        {
          driverName: "Karina Kennedy",
          driverStatus: "ON",
          drivingCycle: "10D",
          vehicle: "F 3650",
          trailer: "2356",
          scheduleStatus: "on Time",
          dispatchId: "DIS-6140",
          loadCapacity: "1001 tonnes",
          speed: "50 mile/hr",
          location: [50.86045, -114.036036],
          temprature: {
            setTemperature: "15",
            actualTemperature: "14",
          },
          referTemprature: {
            refeer1: "14",
            refeer2: "15",
            refeer3: "16",
          },
        },
        {
          driverName: "Dru Drake",
          driverStatus: "ON",
          drivingCycle: "10D",
          vehicle: "F 3650",
          trailer: "2356",
          scheduleStatus: "on Time",
          dispatchId: "DIS-6140",
          loadCapacity: "1001 tonnes",
          speed: "50 mile/hr",
          location: [50.751927, -111.897283],
          temprature: {
            setTemperature: "15",
            actualTemperature: "14",
          },
          referTemprature: {
            refeer1: "14",
            refeer2: "15",
            refeer3: "16",
          },
        },
        {
          driverName: "Drain Drake",
          driverStatus: "ON",
          drivingCycle: "10D",
          vehicle: "F 3650",
          trailer: "2356",
          scheduleStatus: "Late",
          dispatchId: "DIS-6140",
          loadCapacity: "1200 tonnes",
          speed: "40 mile/hr",
          location: [50.978391, -110.041988],
          temprature: {
            setTemperature: "15",
            actualTemperature: "14",
          },
          referTemprature: {
            refeer1: "14",
            refeer2: "15",
            refeer3: "16",
          },
        },
      ],
    };

    return mockData;
  }

  flyToDriver(currentFeature) {
    this.map.setCenter({
      lat: currentFeature[0],
      lng: currentFeature[1],
    });
    this.visible = false;
    this.map.getViewModel().setLookAtData({
      zoom: 17,
    });
  }

  ngAfterViewInit(): void {}

  fetchActiveTrips() {
    this.apiService.getData("trips/get/active").subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.activeTrips = result.Items;
      },
    });
  }
}
