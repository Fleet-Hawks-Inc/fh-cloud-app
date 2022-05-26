import { Component, OnInit, ViewChild, Input  } from '@angular/core';
import { Console } from 'console';
import { ApiService} from '../../../../services/api.service'
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Table } from 'primeng/table';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { HereMapService } from 'src/app/services';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})

export class DeviceListComponent implements OnInit {

  next: any = '';
  @ViewChild('dt') table: Table;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  public devices: any = [];
  listView = true;
  visible = true;
  loadMsg: string = Constants.NO_LOAD_DATA;
  isSearch = false;
  get = _.get;
  _selectedColumns: any[];
  loaded = false;
  
   dataColumns = [
        { width: '8%', field: 'type', header: 'Type', type: "text" },
        { field: 'deviceSerialNo', header: 'Serial/IMEI', type: "text" },
        { field: 'devicesName', header: 'Device Name', type: "text" },
         { field: 'vehicleasset', header: '	Vehicle/Asset', type: "text" },
        { field: 'deviceStatus', header: 'Status', type: "text" },
    ];
  
   constructor(private apiService: ApiService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    private hereMap: HereMapService,
    protected _sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private router: Router) { }

  async ngOnInit(): Promise<void>  {
    this.next = 'null';
    this.devices = [];
    await this.fetchDevices();
    this.setToggleOptions();
  }

  refreshData() {
    this.next = 'null';
    this.devices = [];
    this.fetchDevices();
  }

    setToggleOptions() {
        this.selectedColumns = this.dataColumns;
    }
    
    @Input() get selectedColumns(): any[] {
        return this._selectedColumns;
    }
    
    set selectedColumns(val: any[]) {
        //restore original order
        this._selectedColumns = this.dataColumns.filter(col => val.includes(col));
    }

  private async fetchDevices() {
    try {
      if (this.next === 'end') {
        return;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      const result: any = await this.apiService.getData(`devices/getDevices/${this.next}`).toPromise();

      if (result && result.data.length > 0) {
        result.data.forEach(device => {
          let deviceItem: any = {
            deviceName: device.deviceName,
            deviceStatus: device.deviceStatus,
            deviceSerialNo: device.deviceSerialNo,
            description: device.description,
            deviceType: device.deviceType,
            deviceID: device.deviceID,
            vehicle: {
              vehicleID: '',
              vehicleIdentification: ''
            },
            asset: {
              assetID: '',
              assetIdentification: ''
            }
          }
          if (device.vehicleIdentification) {
            deviceItem.vehicle.vehicleID = device.vehicleID;
            deviceItem.vehicle.vehicleIdentification = device.vehicleIdentification;
          }
          if (device.assetIdentification) {
            deviceItem.asset.assetID = device.assetID;
            deviceItem.asset.assetIdentification = device.assetIdentification;
          }
          this.devices.push(deviceItem);

        });
        this.next = result.nextPage || 'end';

      } else {
        this.next = 'end'
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
                 this.loaded = true;
            this.isSearch = false;
    }
    catch (error) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
      console.error(error)
      throw new Error(error)
    }
  }

  public deactivateDevice(devicesType: any, deviceID: string, activate: boolean) {
    const confirmationText = activate == true ? 'activate' : 'deactivate';
    const status = activate == true ? 'activated' : 'deactivated';
    if (confirm(`Are you sure you want to ${confirmationText}?`) === true) {
      try {
        let body: any = {
          deviceType: devicesType,
          deviceID: deviceID,
          activate: activate
        }
        this.apiService.putData(`devices/deactivate`, body).subscribe((result) => {
          if (result) {
            this.devices = [];
            this.next = 'null';
            this.fetchDevices();
            this.toastr.success(`Device ${status} Successfully`)
          }
        })
      }
      catch (error) {
        console.error(error)
        throw new Error(error)
      }
    }
  }

  onScroll= async (event: any) => {
       if (this.loaded) {
            this.fetchDevices();
        }
    
    this.loaded = false;

  }

  clear(table: Table) {
        table.clear();
    }
 
  gotoAssetTracker(device) {

    this.router.navigate(
      [`/fleet/tracking/asset-tracker/${device.asset.assetIdentification}`],
      {
        queryParams: { assetId: device.asset.assetID },

      }
    );
  }
}
