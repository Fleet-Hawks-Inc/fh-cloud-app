import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services';
import { LeafletMapService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { from } from 'rxjs';
import { Subject, throwError } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { HereMapService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
declare var L: any;
@Component({
  selector: 'app-add-geofence',
  templateUrl: './add-geofence.component.html',
  styleUrls: ['./add-geofence.component.css'],
})
export class AddGeofenceComponent implements OnInit {
  pageTitle = 'Add Geofence';
  geofenceData = {
    geofence: {
      type: '',
      cords: []
    }
  };
  getGeofenceID;
  public marker;
  public map;
  destinationLocation;
  polygonData = [];
  showDestination = true;
  private readonly search: any;
  public searchTerm = new Subject<string>();
  public searchResults: any;


  errors = {};
  form;

  /********** Form Fields ***********/

  fenceName = '';
  location = '';
  geofenceType = '';
  description = '';
  geoLocation = {
    latitude: '',
    longitude: '',
  };
  geofence = '';
  geofenceNewCategory = '';
  /******************/

  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';

  constructor(
    private route: ActivatedRoute,
    private HereMap: HereMapService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private LeafletMap: LeafletMapService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.getGeofenceID = this.route.snapshot.params['fenceID'];
    if (this.getGeofenceID) {
      this.pageTitle = 'Edit Geofence';
      this.fetchGeofenceByID();
    } else {
      this.pageTitle = 'Add Geofence';

    }
    // here maps initialization
    this.map = this.LeafletMap.initGeoFenceMap();
    this.mapControls(this.map);
    this.searchLocation();
    
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  mapControls = (map) => {
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
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
    map.on('pm:create', (e) => {
      // alert('pm:create event fired. See console for details');
      const layer = e.layer;

      const polyEdit = layer.toGeoJSON();
      this.geofenceData.geofence.type = polyEdit.geometry.type;
      this.geofenceData.geofence.cords = polyEdit.geometry.coordinates;

      layer.on('pm:edit', ({ layer }) => {

        const polyEdit = layer.toGeoJSON();
        this.geofenceData.geofence.type = polyEdit.geometry.type;
        this.geofenceData.geofence.cords = polyEdit.geometry.coordinates;

      });

      layer.on('pm:update', ({ layer }) => {

        const polyEdit = layer.toGeoJSON();
        this.geofenceData.geofence.type = polyEdit.geometry.type;
        this.geofenceData.geofence.cords = polyEdit.geometry.coordinates;

        console.log('update', this.geofenceData);

      });


    });

    map.on('pm:cut', function (e) {
      // console.log('cut event on map');
      // console.log(e);
    });
    map.on('pm:remove', function (e) {
     // console.log('pm:remove event fired.');
      // alert('pm:remove event fired. See console for details');
      // console.log(e);
    });
  }


  addCategory() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    const data1 = {
      geofenceNewCategory: this.geofenceNewCategory
    };
    console.log(data1);
  }
  addGeofence() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    // this.spinner.show();
    console.log(this.geofenceData);
    this.apiService.postData('geofences', this.geofenceData).subscribe({
      complete: () => { },
      error: (err) => {
        from(err)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
              this.spinner.hide();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.toastr.success('Geofence Added successfully');
        this.spinner.hide();
        this.router.navigateByUrl('/fleet/geofence/list');
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  createGeofenceTypeModal() {
    $(document).ready(function () {
      $('#addGeofenceCategoryModal').modal('show');
    });
  }

  fetchGeofenceByID() {
    this.spinner.show();
    this.apiService
      .getData('geofences/' + this.getGeofenceID)
      .subscribe((result: any) => {
        result = result.Items[0];
        // console.log('result', result);
        this.geofenceData['geofenceID'] = this.getGeofenceID;
        this.geofenceData['geofenceName'] = result.geofenceName;
        this.geofenceData['location'] = result.location;
        this.geofenceData['description'] = result.description;
        this.geofenceData['geofenceType'] = result.geofenceType;
        this.geofenceData.geofence.type = result.geofence.type;
        this.geofenceData.geofence.cords = result.geofence.cords;
        const newCoords = [];
        for (let i = 0; i < result.geofence.cords[0].length - 1; i++) {

          for (let j = 0; j < result.geofence.cords[0][i].length - 1; j++) {
            newCoords.push([result.geofence.cords[0][i][j + 1], result.geofence.cords[0][i][j]]);

          }
        }
        console.log(newCoords);
        // console.log(new_cords);
        const polylayer = L.polygon(newCoords).addTo(this.map);
        if(newCoords.length > 0) {
          this.map.fitBounds(polylayer.getBounds());
        }
        this.mapControls(this.map);
        polylayer.on('pm:update', (e) => {
          const layer = e.layer;
          // console.log("update", layer);
          const polyEdit = layer.toGeoJSON();
          this.geofenceData.geofence.type = polyEdit.geometry.type;
          this.geofenceData.geofence.cords = polyEdit.geometry.coordinates;
        });

        polylayer.on('pm:drag', (e) => {
          const layer = e.layer;
          // console.log("pm:drag", layer);
          const polyEdit = layer.toGeoJSON();
          this.geofenceData.geofence.type = polyEdit.geometry.type;
          this.geofenceData.geofence.cords = polyEdit.geometry.coordinates;
        });
        polylayer.on('pm:remove', (e) => {
          const layer = e.layer;
          console.log("pm:remove", layer);
          const polyEdit = layer.toGeoJSON();
          this.geofenceData.geofence.type = '';
          this.geofenceData.geofence.cords[0] = [];
        });
        this.spinner.hide();
      });
  }
  /*
   * Update asset
  */
 updateGeofence() {
  this.hasError = false;
  this.hasSuccess = false;
  console.log('update', this.geofenceData);
  this.apiService.putData('geofences', this.geofenceData).subscribe({
    complete: () => { },
    error: (err) => {
      from(err.error)
        .pipe(
          map((val: any) => {
            const path = val.path;
            // We Can Use This Method
            const key = val.message.match(/'([^']+)'/)[1];
            console.log(key);
            val.message = val.message.replace(/'.*'/, 'This Field');
            this.errors[key] = val.message;
          })
        )
        .subscribe({
          complete: () => {
            this.throwErrors();
          },
          error: () => { },
          next: () => { },
        });
    },
    next: (res) => {
      this.response = res;
      this.hasSuccess = true;
      this.toastr.success('Geofence updated successfully');
      this.router.navigateByUrl('/fleet/geofence/list');
      this.Success = '';
    },
  });
}
  public searchLocation() {
    let target;
    this.searchTerm.pipe(
      map((e: any) => {
        target = e;
        return e.target.value;
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        return this.HereMap.searchEntries(term);
      }),
      catchError((e) => {
        return throwError(e);
      }),
    ).subscribe(res => {
      console.log('geo search', res);
      this.searchResults = res;

    });
  }

  searchDestination(loc, lat, lng) {
    this.destinationLocation = loc;
    this.geofenceData['location'] = this.destinationLocation;
    // this.map.removeLayer(this.marker)
    this.marker = L.marker([lat, lng]).addTo(this.map);
    this.map.flyTo([lat, lng], 14, {
      animate: true,
      duration: 1.5
    });

  }


}
