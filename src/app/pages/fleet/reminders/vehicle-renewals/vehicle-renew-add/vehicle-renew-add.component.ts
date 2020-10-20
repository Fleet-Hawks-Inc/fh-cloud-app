import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

declare var $: any;

@Component({
    selector: 'app-vehicle-renew-add',
    templateUrl: './vehicle-renew-add.component.html',
    styleUrls: ['./vehicle-renew-add.component.css']
})
export class VehicleRenewAddComponent implements OnInit {

  reminderID;
  pageTitle;
  reminderData = {
    reminderType: 'vehicle',
    reminderTasks: {
      remindByDays: 0
    },
    subscribers: []
  };
  test = [];
  midArray = [];
  numberOfDays: number;
  time: number;
  timeType: string;
  finalSubscribers = [];
  vehicles = [];
  users = [];
  groups = [];
  form;
  errors = {};
  Error = '';
  Success = '';
  response: any = '';
  hasError = false;
  hasSuccess = false;
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService,
              private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>, private location: Location) { }
  
  
  
}
