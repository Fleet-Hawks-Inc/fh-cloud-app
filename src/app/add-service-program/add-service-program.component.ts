import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";
import {catchError, map, mapTo, tap} from 'rxjs/operators';
import {from, of} from 'rxjs';
declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-add-service-program',
  templateUrl: './add-service-program.component.html',
  styleUrls: ['./add-service-program.component.css']
})
export class AddServiceProgramComponent implements OnInit, AfterViewInit {
  title = 'Add Service Program';

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

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {}


  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }


  addServiceProgram() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "programName": this.programName,
      "repeatByTime" : this.repeatByTime,
      "repeatByOdometer": this.repeatByOdometer,
      "description": this.description,
    };

    this.apiService.postData('servicePrograms', data)
      .subscribe({
        complete : () => {},
        error : (err) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.key] = val.message;
              }),
            )
            .subscribe((val) => {
              this.throwErrors();
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
