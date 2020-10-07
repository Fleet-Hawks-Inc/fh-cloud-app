import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {ApiService} from '../../../../../services';
import { map} from 'rxjs/operators';
import {from} from 'rxjs';

declare var $: any;


@Component({
  selector: 'app-add-service-program',
  templateUrl: './add-service-program.component.html',
  styleUrls: ['./add-service-program.component.css']
})
export class AddServiceProgramComponent implements OnInit, AfterViewInit {
  title = 'Add Service Program';

  meterText = 'Miles';
  serviceData = {}

  errors = {};
  form;

  /********** Form Fields ***********/

  programName ='';
  repeatByTime = '';
  repeatByOdometer = '';
  description = '';

  /******************/

  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private apiService: ApiService, private router: Router) {}


  ngOnInit() {}


  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }


  addServiceProgram() {
    console.log('service program',this.serviceData);
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      programName: this.programName,
      repeatByTime : this.repeatByTime,
      repeatByOdometer: this.repeatByOdometer,
      description: this.description,
    };
    console.log('data',data)
    this.apiService.postData('servicePrograms', this.serviceData).subscribe({
        complete : () => {},
        error: (err) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                const path = val.path;
                // We Can Use This Method
                const key = val.message.match(/'([^']+)'/)[1];
                // console.log(key);
                // this.errors[key] = val.message;
                // Or We Can Use This One To Extract Key
                // const key = this.concatArray(path);
                // this.errors[this.concatArray(path)] = val.message;
                // if (key.length === 2) {
                // this.errors[val.context.key] = val.message;
                // } else {
                // this.errors[key] = val.message;
                // }
                val.message = val.message.replace(/'.*'/, 'This Field');
                this.errors[key] = val.message;
                // console.log(this.errors);
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
              },
              error: () => {},
              next: () => {},
            });
        },
        next: (res) => {
          this.programName = '';
          this.repeatByTime = '';
          this.repeatByOdometer = '';
          this.description = '';
          this.response = res;
          this.hasSuccess = true;
          this.Success = 'Service Program Added successfully';

        }
      });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }



}
