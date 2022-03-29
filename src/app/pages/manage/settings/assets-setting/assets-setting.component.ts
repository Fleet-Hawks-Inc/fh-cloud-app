import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import CSVFileValidator, { ParsedResults, ValidatorConfig, } from 'csv-file-validator';
@Component({
  selector: 'app-assets-setting',
  templateUrl: './assets-setting.component.html',
  styleUrls: ['./assets-setting.component.css']
})
export class AssetsSettingComponent implements OnInit {
  constructor() { }

  ngOnInit() {

  }

}
