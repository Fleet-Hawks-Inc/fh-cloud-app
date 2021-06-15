import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { timer } from 'rxjs';
import {CountryStateCity} from 'src/app/shared/utilities/countryStateCities'
import Constants from '../../../fleet/constants';
import {NgxSpinnerService} from 'ngx-spinner'
declare var $: any;
@Component({
  selector: 'app-mileage',
  templateUrl: './mileage.component.html',
  styleUrls: ['./mileage.component.css']
})
export class MileageComponent implements OnInit {

  activeTab = 'jurisdiction';
  public countries:any;
  public states:any;
  public baseCountry:any;
  public vehicleList:any;
  public recordCount:any;
  public dataMessage:any;
  public isRecords:any;
  public recordStartPoint:any;
  public recordEndPoint:any;
  public recordDraw:any;
  public pageLength=10;
  public records:any;
  public recordNext:any;
  public recordPrevEvauatedKeys:any;
  public lastEvaluatedKey='';
  public totalRecords;
  public recordPrev:any;
  constructor(private apiService: ApiService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.fetchCountries();
    this.fetchVehicleList();
    this.fetchCount();

  }

  fetchCount(){
    this.recordCount=0;
    this.apiService.getData('ifta/get/count').subscribe({
      complete:()=>{},
      error:()=>{},
      next:(result:any)=>{
        this.recordCount=result.Count;
        console.log(result.Count)
        this.initDataTable();
      }

    })

  }
  fetchCountries() {
  this.countries=CountryStateCity.GetAllCountries();
  }
  getStates() {
    this.states=CountryStateCity.GetStatesByCountryCode([this.baseCountry])
  }
  addIftaAccount() {
    // const data = {
    //   baseState : this.baseState,
    //   baseCountry: this.baseCountry,
    //   accountNumber:  this.accountNumber,
    //   signingAuthority: {
    //     name: '',
    //     phone: '',
    //     title: '',
    //   }
    // };
  }

  getStartandEndVal(type){
    if(type=='all'){
      this.recordStartPoint=this.recordDraw*this.pageLength+1;
      this.recordEndPoint=this.recordStartPoint + this.pageLength -1;
    }
  }
  initDataTable() {
   this.spinner.show();
   this.apiService.getData('ifta/fetch/records?lastKey=' + this.lastEvaluatedKey)
   .subscribe((result:any)=>{
     if(result.Items.length==0){
       this.dataMessage=Constants.NO_RECORDS_FOUND;
       this.isRecords=false;
     }
     else{
       this.isRecords=true;
     }
    this.getStartandEndVal('all');
    this.records=result.Items
    if (result['LastEvaluatedKey'] !== undefined) {
      let lastEvalKey = result[`LastEvaluatedKey`].iftaSK.replace(/#/g,'--');
      this.recordNext = false;
      // for prev button
      if (!this.recordPrevEvauatedKeys.includes(lastEvalKey)) {
        this.recordPrevEvauatedKeys.push(lastEvalKey);
      }
      this.lastEvaluatedKey = lastEvalKey;

    } else {
      this.recordNext = true;
      this.lastEvaluatedKey = '';
      this.recordEndPoint = this.totalRecords;
    }

    if(this.totalRecords < this.recordEndPoint) {
      this.recordEndPoint = this.totalRecords;
    }
    if (this.recordDraw > 0) {
      this.recordPrev = false;
    } else {
      this.recordPrev = true;
    }
    this.spinner.hide();
  }, err => {
    this.spinner.hide();
  });
  }
  
  
  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }
}
