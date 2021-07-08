import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import {ListService} from '../../../../services/list.service'
import {ActivatedRoute} from '@angular/router'
import {CountryStateCity} from 'src/app/shared/utilities/countryStateCities'
import Constants from '../../../fleet/constants';
import {NgxSpinnerService} from 'ngx-spinner'
import { HttpClient} from '@angular/common/http'
import {jsPDF} from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as moment from 'moment'

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
  public recordCount=10;
  public pageLength=10;
  public dataMessage:any;
  public isRecords=false;
  public recordStartPoint=1;
  public recordEndPoint=this.pageLength;
  public recordDraw=0;
  public records=[];
  public recordNext=false;
  public recordPrevEvauatedKeys=[''];
  public lastEvaluatedKey='';
  public recordPrev=true;
  public quarter:any;
  public quarterReport:any={};
  public jurisdictionReport:any;
  public recs=false;
  public canadianStates={};
  public usStates={}
  public fuelList=[]
  public filterFuel=""
  public filterVehicle=""
  public average
  public fuelGroup
  public quarters={
    '1':"JAN - MAR",
    '2':"APR - JUN",
    '3':"JUL - SEP",
    '4':"OCT - DEC"
  }
  public carrierName="";
  public username=""
  constructor(private apiService: ApiService, private spinner: NgxSpinnerService,private route: ActivatedRoute, private listService: ListService, private httpClient: HttpClient) { }

  ngOnInit() {
    this.quarter=this.route.snapshot.params['quarter']
    this.quarter
    this.fetchJurisdiction();
    this.fetchCountries();
    this.fetchCount();
    this.fetchVehicles();
    this.fetchWexFuelCode();
    this.fetchQuarterRreport();
    this.getCanadaStates();
    this.getUSStates();
    this.groupByFuelType();
    this.fetchCarrierData();
    
  }
  fetchCarrierData(){
    this.apiService.getData(`carriers/getCarrier`).subscribe(result=>{
      this.carrierName=result.Items[0].carrierName
      this.username=result.Items[0].userName
    })
  }
  groupByFuelType(){
    this.apiService.getData(`ifta/groupFuelType/${this.quarter}`).subscribe((result:any)=>{
      
      this.fuelGroup=result
    })
  }
  fetchWexFuelCode(){
    let fuelList=[]
      this.httpClient.get('assets/jsonFiles/fuel/wexFuelType.json').subscribe((result: any) => {      
        result.forEach(element => {
          fuelList.push(element.type)
        });
      });
this.fuelList=["Diesel","Gasoline","Propane"]

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
    this.dataMessage = Constants.FETCHING_DATA;
    this.lastEvaluatedKey=''
    this.isRecords=false;
    this.records=[]
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
      
      this.quarterReport.totalMiles=result[0].totalMiles
      this.quarterReport.iftaDistance=result[0].iftaDistance
      this.quarterReport.nonIftaDistance=result[0].nonIftaDistance
      this.quarterReport.quantityUnit=result[0].quantityUnit
      this.quarterReport.distanceUnit=result[0].distanceUnit
      this.quarterReport.quarter=result[0].quarter
      this.quarterReport.totalQuantity=result[0].totalQuantity
      this.quarterReport.totalYear=result[0].totalYear

      this.average=(this.quarterReport.totalMiles/this.quarterReport.totalQuantity).toFixed(2)
      
    })
    

  }
  getPDF(element){
    let quart=this.quarter.split("-")
    let today=moment().format("MMMM Do YYYY")
    if(this.jurisdictionReport){
      const doc=new jsPDF({orientation:"p",unit:'mm',format:'a4'});
      
      
      let data = this.jurisdictionReport.filter(el=>el.fuelType==element.fuelType)
      let filteredData=[]
      data.forEach(e=>{
        let d={
          jurisdiction:e.jurisdiction,
          quantity:e.quantity,
          totalMiles:e.totalMiles
        }
        filteredData.push(d)
      })
      let dataArray=[]
      filteredData.forEach(ele=>{
        dataArray.push(Object.values(ele))
      })
      
      autoTable(doc,{
        styles: { },
        columnStyles: {  }, 
        margin: { top: 100 },
        theme: 'striped',
        headStyles: {
          fillColor: [0, 0, 0],
          
        },
        head:[
          { jurisdiction: 'Jurisdiction', quantity: `Quantity(${this.quarterReport.quantityUnit})`, distance: `Distance(${this.quarterReport.distanceUnit})`},
        ],
        body: dataArray,
        didDrawPage:(data)=>{
          
      doc.setFontSize(20)
      doc.text('IFTA Report',15, 15 )
      doc.setFontSize(10)
      doc.text('Internation Fuel Tax Agreement Report',15,20,)
      doc.line(15,25,200,25)
      //  doc.addImage('assets/img/logologin.png',160, 5, 73, 14)
      doc.setFontSize(10)
      
      doc.text("Carrier Name",15,35)  
      doc.setFontSize(11)
      doc.text(this.carrierName,15,40)
      doc.setFontSize(10)
      doc.text("Quarter/ Year",160,35)
      doc.setFontSize(11)
      doc.text(`${this.quarters[quart[0]]}`,160,40)
      doc.setFontSize(10)
      doc.text("Created Date",15,50)
      doc.setFontSize(11)
      doc.text(`${today}`,15,55)
      doc.setFontSize(10)
      doc.text("Created By",160,50)
      doc.setFontSize(11)
      doc.text(this.username,160,55)
      doc.setFontSize(10)
      // doc.text("IFTA Report #",160,50)
      // doc.setFontSize(11)
      // doc.text("123456",160,55)
      autoTable(doc,{
        styles: { },
        columnStyles: {  }, // Cells in first column centered and green
        margin: { top: 60 },
        theme: 'grid',
        body: [
          [`Total Distance: ${element.totalDistance} ${this.quarterReport.distanceUnit}`, `Total Fuel Quantity: ${element.totalQuantity} ${this.quarterReport.distanceUnit}`],
          [`Total IFTA Distance: ${element.totalIftaDistance} ${this.quarterReport.distanceUnit}`, `Total Non IFTA Distance: ${element.nonIftaDistance} ${this.quarterReport.distanceUnit}`],
          [`Fuel Type: ${element.fuelType}`, `Average ${this.quarterReport.distanceUnit}/${element.quantityUnit}:${(element.totalDistance/element.totalQuantity).toFixed(2)} ${this.quarterReport.distanceUnit}/${element.quantityUnit}`],
        ],
      })

        },
      })
      
     doc.save(`ifta ${this.quarter}-${element.fuelType}.pdf`)

  }
}

   generatePDF(){
    this.groupByFuelType();

    this.fuelGroup.forEach(element => {
      this.getPDF(element)  
    });
    
    
  }


  nextResults() {
    
      this.recordNext = true;
      this.recordDraw += 1;
      this.recordPrev=true
      
        this.initDataTable();
    
  }
  // prev button func
  prevResults() {
      this.recordNext = true;
      this.recordPrev = true;
      this.recordDraw -= 1;
      this.lastEvaluatedKey=this.recordPrevEvauatedKeys[this.recordDraw]
      this.initDataTable();
      
  
  }

  fetchCount(){
    
    this.apiService.getData('ifta/get/count?quarter='+this.quarter+'&vehicle='+this.filterVehicle+'&fuelType='+this.filterFuel).subscribe({
      complete:()=>{},
      error:()=>{},
      next:(result:any)=>{
        this.recordCount=result.Count;
        
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


  getStartandEndVal(){
 
      this.recordStartPoint=this.recordDraw*this.pageLength+1;
      this.recordEndPoint=this.recordStartPoint + this.pageLength -1;
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
    this.getStartandEndVal();
   this.fetchRecords(result)
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
  

  fetchRecords(result){
    this.records=result.Items

  }
  
}
