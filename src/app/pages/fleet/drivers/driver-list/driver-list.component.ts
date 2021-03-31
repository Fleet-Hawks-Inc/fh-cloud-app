import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services/here-map.service';
import { Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import  Constants  from '../../constants';

declare var $: any;

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css'],
})
export class DriverListComponent implements OnInit {

  allDocumentsTypes: any;
  documentsTypesObects: any = {};

  title = 'Driver List';
  mapView = false;
  listView = true;
  visible = true;
  dataMessage: string = Constants.FETCHING_DATA;

  driverCheckCount;
  selectedDriverID;
  drivers = [];

  statesObject: any = {};
  countriesObject: any = {};
  citiesObject: any = {};
  vehiclesObject: any = {};
  cyclesObject: any = {};
  groupssObject:any = {}

  driverID = '';
  driverName = '';
  dutyStatus = '';
  suggestedDrivers = [];
  homeworld: Observable<{}>;

  totalRecords = 10;
  pageLength = 10;
  lastEvaluatedKey = '';
  currentStatus: any;
  hideShow = {
    name: true,
    dutyStatus: true,
    location: true,
    currCycle: true,
    currVehicle: false,
    assets: false,
    contact: false,
    dl: false,
    document: false,
    status: true,
    groupID: false,
    citizenship: false,
    address: false,
    paymentType: false,
    sin: false,
    contractStart: false,
    homeTerminal: false,
    fastNumber: false
  }

  driverNext = false;
  driverPrev = true;
  driverDraw = 0;
  driverPrevEvauatedKeys = [''];
  driverStartPoint = 1;
  driverEndPoint = this.pageLength;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private hereMap: HereMapService,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    
    // this.hideShowColumn();
    this.fetchAllDocumentsTypes();
    this.fetchDriversCount();
    this.fetchAllStatesIDs();
    this.fetchAllVehiclesIDs();
    this.fetchAllCyclesIDs();
    this.fetchAllCountriesIDs();
    this.fetchAllCitiesIDs();
    this.fetchAllGrorups();
    this.initDataTable();

    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }

  fetchAllDocumentsTypes() {
    this.httpClient.get("assets/travelDocumentType.json").subscribe((data: any) =>{
      this.allDocumentsTypes = data;
      this.documentsTypesObects =  data.reduce( (a: any, b: any) => {
        return a[b['code']] = b['description'], a;
    }, {});
    })
  }

  jsTree() {
    $('.treeCheckbox').jstree({
      core: {
        themes: {
          responsive: false
        }
      },
      types: {
        default: {
          icon: 'fas fa-folder'
        },
        file: {
          icon: 'fas fa-file'
        }
      },
      plugins: ['types', 'checkbox']
    });

  }

  export() {
    $('.buttons-excel').trigger('click');
  }

  getSuggestions(value) {
    this.driverID = '';
    value = value.toLowerCase();
    if(value != '') {
      this.apiService
      .getData(`drivers/get/suggestions/${value}`)
      .subscribe((result) => {
        result.Items.map((v)=>{
          if(v.middleName == undefined) {
            v.middleName = '';
          }
          if(v.lastName == undefined) {
            v.lastName = '';
          }
          return v;
        })
        this.suggestedDrivers = result.Items;
      });
    } else {
      this.suggestedDrivers = [];
    }
    
  }

  setDriver(driverID, firstName, lastName) {
    this.driverName = firstName+' '+lastName;
    // this.driverID = driverID;
    this.driverID = firstName+'-'+lastName;

    this.suggestedDrivers = [];
  }

  fetchDriversCount() {
    this.apiService.getData('drivers/get/count?driver='+this.driverID+'&dutyStatus='+this.dutyStatus).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;

        if(this.driverID != '') {
          this.driverEndPoint = this.totalRecords;
        }
      },
    });
  }

  fetchAllStatesIDs() {
    this.apiService.getData('states/get/list')
    .subscribe((result: any) => {
      this.statesObject = result;
    });

  }


  fetchAllCountriesIDs() {
    this.apiService.getData('countries/get/list')
    .subscribe((result: any) => {
      this.countriesObject = result;
    });
  }

  fetchAllGrorups() {
    this.apiService.getData('groups/get/list')
    .subscribe((result: any) => {
      this.groupssObject = result;
    });
  }

  fetchAllCitiesIDs() {
    this.apiService.getData('cities/get/list')
    .subscribe((result: any) => {
      this.citiesObject = result;
    });
  }

  fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/get/list')
    .subscribe((result: any) => {
      this.vehiclesObject = result;
    });
  }

  fetchAllCyclesIDs() {
    this.apiService.getData('cycles/get/list')
    .subscribe((result: any) => {
      this.cyclesObject = result;
    });
    
  }


  checkboxCount = () => {
    this.driverCheckCount = 0;
    this.drivers.forEach(item => {
      if (item.checked) {
        this.selectedDriverID = item.driverID;
        this.driverCheckCount = this.driverCheckCount + 1;
      }
    });
  }

  editDriver = () => {
    if (this.driverCheckCount === 1) {
      this.router.navigateByUrl('/fleet/drivers/edit-driver/' + this.selectedDriverID);
    } else {
      this.toastr.error('Please select only one asset!');
    }
  }

  mapShow() {
    this.mapView = true;
    this.listView = false;
    setTimeout(() => {
      this.jsTree();
      this.hereMap.mapInit();
    }, 200);
  }

  valuechange() {
    this.visible = !this.visible;
  }


  deactivateDriver(item, driverID) {

    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
        .getData(`drivers/isDeleted/${driverID}/${item.isDeleted}`)
        .subscribe((result: any) => {

          this.drivers = [];
          this.fetchDriversCount();
          this.initDataTable();
          this.toastr.success('Driver is deactivated!');
        }, err => {
         
        });
    }
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('drivers/fetch/records?driver='+this.driverID+'&dutyStatus='+this.dutyStatus+ '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedDrivers = [];
        this.getStartandEndVal();
        this.drivers = result['Items'];

        if(this.driverID != '') {
          this.driverStartPoint = 1;
          this.driverEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.driverNext = false;
          // for prev button
          if (!this.driverPrevEvauatedKeys.includes(result['LastEvaluatedKey'].driverID)) {
            this.driverPrevEvauatedKeys.push(result['LastEvaluatedKey'].driverID);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'].driverID;
          
        } else {
          this.driverNext = true;
          this.lastEvaluatedKey = '';
          this.driverEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.driverDraw > 0) {
          this.driverPrev = false;
        } else {
          this.driverPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  searchFilter() {
    if(this.driverName !== '' || this.dutyStatus !== '') {
      if(this.driverID == '') {
        this.driverID = this.driverName;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      this.suggestedDrivers = [];
      this.fetchDriversCount();
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.driverName !== '' || this.dutyStatus !== '') {
      this.drivers = [];
      this.driverID = '';
      this.dutyStatus = '';
      this.driverName = '';
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchDriversCount();
      this.initDataTable();
      this.driverDraw = 0;
      this.resetCountResult();
    } else {
      return false;
    }
  }

  hideShowColumn() {
    //for headers
    if(this.hideShow.name == false) {
      $('.col1').css('display','none');
    } else {
      $('.col1').css('display','');
    }

    if(this.hideShow.dutyStatus == false) {
      $('.col2').css('display','none');
    } else {
      $('.col2').css('display','');
    }

    if(this.hideShow.location == false) {
      $('.col18').css('display','none');
    } else {
      $('.col18').css('display','');
    }

    if(this.hideShow.currCycle == false) {
      $('.col11').css('display','none');
    } else {
      $('.col11').css('display','');
    }

    if(this.hideShow.currVehicle == false) {
      $('.col12').css('display','none');
    } else {
      $('.col12').removeClass('extra');
      $('.col12').css('display','');
      $('.col12').css('min-width','200px');
    }

    if(this.hideShow.assets == false) {
      $('.col13').css('display','none');
    } else {
      $('.col13').removeClass('extra');
      $('.col13').css('display','');
      $('.col13').css('min-width','200px');
    }

    if(this.hideShow.contact == false) {
      $('.col14').css('display','none');
    } else {
      $('.col14').removeClass('extra');
      $('.col14').css('display','');
      $('.col14').css('min-width','200px');
    }

    if(this.hideShow.dl == false) {
      $('.col15').css('display','none');
    } else {
      $('.col15').removeClass('extra');
      $('.col15').css('display','');
      $('.col15').css('min-width','200px');
    }

    if(this.hideShow.document == false) {
      $('.col16').css('display','none');
    } else {
      $('.col16').removeClass('extra');
      $('.col16').css('display','');
      $('.col16').css('min-width','200px');
    }

    if(this.hideShow.status == false) {
      $('.col17').css('display','none');
    } else {
      $('.col17').css('display','');
    }

    //extra columns
    if(this.hideShow.groupID == false) {
      $('.col3').css('display','none');
    } else { 
      $('.col3').removeClass('extra');
      $('.col3').css('display','');
      $('.col3').css('min-width','200px');
    }

    if(this.hideShow.citizenship == false) {
      $('.col4').css('display','none');
    } else { 
      $('.col4').removeClass('extra');
      $('.col4').css('display','');
      $('.col4').css('min-width','200px');
    }

    if(this.hideShow.address == false) {
      $('.col5').css('display','none');
    } else { 
      $('.col5').removeClass('extra');
      $('.col5').css('display','');
      $('.col5').css('min-width','200px');
    }
    
    if(this.hideShow.paymentType == false) {
      $('.col6').css('display','none');
    } else { 
      $('.col6').removeClass('extra');
      $('.col6').css('display','');
      $('.col6').css('min-width','200px');
    }

    if(this.hideShow.sin == false) {
      $('.col7').css('display','none');
    } else { 
      $('.col7').removeClass('extra');
      $('.col7').css('display','');
      $('.col7').css('min-width','200px');
    }

    if(this.hideShow.contractStart == false) {
      $('.col8').css('display','none');
    } else { 
      $('.col8').removeClass('extra');
      $('.col8').css('display','');
      $('.col8').css('min-width','200px');
    }

    if(this.hideShow.homeTerminal == false) {
      $('.col9').css('display','none');
    } else { 
      $('.col9').removeClass('extra');
      $('.col9').css('display','');
      $('.col9').css('min-width','200px');
    }

    if(this.hideShow.fastNumber == false) {
      $('.col10').css('display','none');
    } else { 
      $('.col10').removeClass('extra');
      $('.col10').css('display','');
      $('.col10').css('min-width','200px');
    }
    

  }

  getStartandEndVal() {
    this.driverStartPoint = this.driverDraw * this.pageLength + 1;
    this.driverEndPoint = this.driverStartPoint + this.pageLength - 1;
  }

  // next button func
  nextResults() {
    this.driverNext = true;
    this.driverPrev = true;
    this.driverDraw += 1;
    this.initDataTable();
  }

  // prev button func
  prevResults() {
    this.driverNext = true;
    this.driverPrev = true;
    this.driverDraw -= 1;
    this.lastEvaluatedKey = this.driverPrevEvauatedKeys[this.driverDraw];
    this.initDataTable();
  }

  resetCountResult() {
    this.driverStartPoint = 1;
    this.driverEndPoint = this.pageLength;
    this.driverDraw = 0;
  }
}
