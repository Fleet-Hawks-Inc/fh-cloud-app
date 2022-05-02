import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-setting',
  templateUrl: './customer-setting.component.html',
  styleUrls: ['./customer-setting.component.css']
})
export class CustomerSettingComponent implements OnInit {


  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit() {

  }

}