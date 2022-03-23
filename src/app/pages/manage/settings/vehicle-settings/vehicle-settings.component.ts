
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import CSVFileValidator, { ParsedResults, ValidatorConfig, } from 'csv-file-validator';
declare var $: any;
@Component({
  selector: 'app-vehicle-settings',
  templateUrl: './vehicle-settings.component.html',
  styleUrls: ['./vehicle-settings.component.css']
})
export class VehicleSettingsComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
