import { Component, OnInit } from '@angular/core';
import { map, debounceTime, distinctUntilChanged, catchError, switchMap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { HereMapService, ApiService } from '../../../../services';

declare var $: any;

@Component({
  selector: 'app-total-miles',
  templateUrl: './total-miles.component.html',
  styleUrls: ['./total-miles.component.css']
})
export class TotalMilesComponent implements OnInit {
    public searchTerm = new Subject<string>();
     public searchResults: any;
     newCoords = [];
     routeData: any = {
      totalMiles : 0, 
      miles: 0,
      location : [{
        totalMiles : 0,
        miles: 0,
        sourceAddress: '',
        destAddress: '',
        sourceLat: '',
        sourceLng: '',
        destLat: '',
        destLng: '',
      }],
      stops: [],
      data: [],
      };
      
  constructor(
    private apiService: ApiService,
    private hereMap: HereMapService) { }

  ngOnInit(): void {
    this.searchLocation();
  }
  
  public searchLocation() {
    this.searchTerm.pipe(
      map((e: any) => {
        $('.map-search__results').hide();
        $(e.target).closest('div').addClass('show-search__result');
        return e.target.value;
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        return this.hereMap.searchEntries(term);
      }),
      catchError((e) => {
        return throwError(e);
      }),
    ).subscribe(res => {
      this.searchResults = res;
    });
  }
  
  async getCoords(data:any) {
    this.newCoords = [];
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      this.newCoords.push(`${element.lat},${element.lng}`);
    }
    await this.getMiles(this.routeData.location);
  }
  
  async getAddressDetail(id:any) {
    let result = await this.apiService
    .getData(`pcMiles/detail/${id}`).toPromise();
    return result;
  }
  
  reinitMap() {
    if (this.routeData.stops.length > 1) {
      this.getCoords(this.routeData.stops);
    }
  }
  
    async getMiles(index) {
      let coords = [];
       if(this.routeData.location[index]){
        if(this.routeData.location[index]['sourceAddress'] != '' && this.routeData.location[index]['destAddress'] != ''){
        coords.push(`${this.routeData.location[index]['sourceLng']},${this.routeData.location[index]['sourceLat']}`);  
        coords.push(`${this.routeData.location[index]['destLng']},${this.routeData.location[index]['destLat']}`);  
        }
      }
    let stops = coords.join(";");
    this.apiService.getData('trips/calculate/pc/miles?type=mileReport&stops='+stops).subscribe((result) => {
     this.routeData.location[index].miles = result
     this.calculateMiles();
      });
    }
  
  async assignLocation(elem:any, data:any, index: any = '') {
    let item = {
      name: '',
      lat: '',
      lng: ''
    };
    let coords = [];
    let result = await this.getAddressDetail(data.place_id)
    if(result != undefined) {
      item = {
        name: data.address,
        lat: result.position.lat,
        lng: result.position.lng
      };
      
      if (elem === 'source') {
            this.routeData.location[index]['sourceAddress'] = `${data.address}`;
            this.routeData.location[index]['sourceLat'] = `${result.position.lat}`;
            this.routeData.location[index]['sourceLng'] = `${result.position.lng}`;
            
      } else if (elem === 'destination') {
        this.routeData.location[index]['destAddress'] = `${data.address}`;
        this.routeData.location[index]['destLat'] = `${result.position.lat}`;
        this.routeData.location[index]['destLng'] = `${result.position.lng}`;
      } 
      this.searchResults = false;
      this.reinitMap();
      $('div').removeClass('show-search__result');
      if(this.routeData.location[index]){
        if(this.routeData.location[index]['sourceAddress'] != '' && this.routeData.location[index]['destAddress'] != ''){
        coords.push(`${this.routeData.location[index]['sourceLat']},${this.routeData.location[index]['sourceLng']}`);  
        coords.push(`${this.routeData.location[index]['destLat']},${this.routeData.location[index]['destLng']}`);  
        }
      }
      if(coords.length > 1){
        this.getMiles(index);
      }
    }
  }
  
  clearAddress(index: number) {
    this.routeData.location[index].sourceAddress = ''
    this.routeData.location[index].miles = ''
    this.routeData.location[index].destAddress = ''
    this.calculateMiles();
  }
  
  addAddress(data:any) {
    data.location.push({
    sourceAddress : '',
    destAddress : '',
    miles : ''
    });
  }
  
  removeAddress(index:any) {
    this.routeData.location.splice(index, 1);
    this.calculateMiles();
  }
  
  calculateMiles(){
      this.routeData.location.totalMiles = 0 
      for (const element of this.routeData.location) {
        if(element.miles){
        this.routeData.location.totalMiles += Number(element.miles);
        }
      }
  }
}
