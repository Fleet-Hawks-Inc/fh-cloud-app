import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import {ListService} from '../../../../services/list.service'
import { timer } from 'rxjs';
import {ActivatedRoute} from '@angular/router'
import {CountryStateCity} from 'src/app/shared/utilities/countryStateCities'
import Constants from '../../../fleet/constants';
import {NgxSpinnerService} from 'ngx-spinner'
import { HttpClient} from '@angular/common/http'
import {CommonModule} from '@angular/common/common'

declare var $: any;
@Component({
  selector: 'app-mileage',
  templateUrl: './mileage.component.html',
  styleUrls: ['./mileage.component.css']
})
export class MileageComponent implements OnInit {

  activeTab = 'vehicle';
  public countries:any;
  public states:any;
  public baseCountry:any;
  public vehicleList=[]
  public recordCount:any;
  public pageLength=10;
  public dataMessage:any;
  public isRecords:any;
  public recordStartPoint=1;
  public recordEndPoint=this.pageLength;
  public recordDraw=0;
  public records=[];
  public recordNext=false;
  public recordPrevEvauatedKeys=[];
  public lastEvaluatedKey='';
  public totalRecords;
  public recordPrev=true;
  public quarter:any;
  public quarterReport:any={};
  public jurisdictionReport:any;
  public active='all'
  public recs=false;
  public canadianStates={};
  public usStates={}
  public fuelList=[]
  public filterFuel=""
  public filterVehicle=""
  constructor(private apiService: ApiService, private spinner: NgxSpinnerService,private route: ActivatedRoute, private listService: ListService, private httpClient: HttpClient) { }

  ngOnInit() {
    this.quarter=this.route.snapshot.params['quarter']
    
    
  
    this.fetchCountries();
    this.fetchCount();
    this.fetchVehicles();
    this.fetchWexFuelCode();
    this.fetchQuarterRreport();
    this.fetchAllRecordsCount();
    this.getCanadaStates();
    this.getUSStates();
  }
  fetchWexFuelCode(){
    let fuelList=[]
      this.httpClient.get('assets/jsonFiles/fuel/wexFuelType.json').subscribe((result: any) => {      
        result.forEach(element => {
          fuelList.push(element.type)
        });
      });
this.fuelList=["Diesel","Gasoline","Agricultural","Gas","Propane"]

  }

  fetchVehicleSumary(){
    this.activeTab = 'vehicle'
    this.fetchCount();
  }

  fetchJurisdictionSumary(){
    this.activeTab = 'jurisdiction'
    this.fetchJurisdiction();

  }
  fetchVehicles(){
    this.apiService.getData(`vehicles`).subscribe((result)=>{
      this.vehicleList=result.Items
    })
    

  }

  fetchJurisdiction(){
    this.apiService.getData('ifta/jurisdiction/'+this.quarter).subscribe(result=>{
      this.jurisdictionReport=result;
    })

  }
  filterRecords(){
    if(this.filterFuel==null) this.filterFuel=''

    if(this.filterVehicle==null) this.filterVehicle=''

    if((this.filterFuel!=null)||(this.filterVehicle!=null)){
      this.fetchCount();
    }

  }
  resetFilter(){
    this.filterFuel=''
    this.filterVehicle=''
    this.fetchCount();

  }
  fetchQuarterRreport(){
    this.apiService.getData('ifta/quarter/'+this.quarter).subscribe(result=>{
      console.log(result)
      this.quarterReport.totalMilesCA=result[0].totalMilesCA
      this.quarterReport.totalMilesUS=result[0].totalMilesUS
      this.quarterReport.totalQuantityGallons=result[0].totalQuantityGallons
      this.quarterReport.totalQuantityLitres=result[0].totalQuantityLitres
      this.quarterReport.totalAmountCAD=result[0].totalAmountCAD
      this.quarterReport.totalAmountUSD=result[0].totalAmountUSD
      this.quarterReport.totalDiscountUSD=result[0].totalDiscountUS
      this.quarterReport.totalDiscountCAD=result[0].totalDiscountCA

      
    })

  }
  nextResults(type) {
    if(type == 'all') {
      this.recordNext = true;
      this.recordPrev = true;
      this.recordDraw += 1;
      
        this.initDataTable();
    } 
  }
  // prev button func
  prevResults(type) {
    if(type == 'all') {
      this.recordNext = true;
      this.recordPrev = true;
      this.recordDraw -= 1;
        this.initDataTable();
    } 
  }

  fetchCount(){
    this.recordCount=0;
    this.apiService.getData('ifta/get/count?quarter='+this.quarter+'&vehicle='+this.filterVehicle+'&fuelType='+this.filterFuel).subscribe({
      complete:()=>{},
      error:()=>{},
      next:(result:any)=>{
        this.recordCount=result.Count;
        
        this.initDataTable();
      }

    })

  }

  fetchAllRecordsCount(){
    this.totalRecords=0
    this.apiService.getData('ifta/get/count?quarter='+this.quarter).subscribe({
      complete:()=>{},
      error:()=>{},
      next:(result:any)=>{
        this.totalRecords=result.Count;
        
        this.initDataTable();
      }

    })

  }
  fetchCountries() {
  this.countries=CountryStateCity.GetAllCountries();
  }
  getCanadaStates() {
    let states=CountryStateCity.GetStatesByCountryCode(["CA"])
    states.forEach(element=>{
      this.canadianStates[element.stateCode]=element.stateName
    })
    
  }
  getUSStates(){
    let states=CountryStateCity.GetStatesByCountryCode(['US'])
    states.forEach(element=>{
      this.usStates[element.stateCode]=element.stateName
    })
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
   this.apiService.getData('ifta/fetch/records?quarter='+this.quarter+'&vehicle='+this.filterVehicle+'&fuelType='+this.filterFuel+'&lastKey=' + this.lastEvaluatedKey)
   .subscribe((result:any)=>{
     if(result.Items.length==0){
       
       this.dataMessage=Constants.NO_RECORDS_FOUND;
       this.isRecords=false;
     }
     else{
       this.isRecords=true;
     }
    this.getStartandEndVal('all');
   this.fetchRecords(result,'all')
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
      this.recordEndPoint = this.recordCount;
    }

    if(this.recordCount < this.recordEndPoint) {
      this.recordEndPoint = this.recordCount;
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
  

  fetchRecords(result,type=null){
    this.records=result.Items

  }
  
}
