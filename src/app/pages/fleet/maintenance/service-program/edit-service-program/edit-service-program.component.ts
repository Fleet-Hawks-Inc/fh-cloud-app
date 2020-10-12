import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../../../services';
import { map} from 'rxjs/operators';
import {from} from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-edit-service-program',
  templateUrl: './edit-service-program.component.html',
  styleUrls: ['./edit-service-program.component.css']
})
export class EditServiceProgramComponent implements OnInit, AfterViewInit {
  title = 'Edit Service Program';

  errors = {};
  form;

  /********** Form Fields ***********/

  programName ='';
  repeatByTime = '';
  repeatByOdometer = '';
  description = '';

  /******************/

  programID ='';
  response : any = '';
  hasError = false;
  hasSuccess = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.programID = this.route.snapshot.params['programID'];

    this.apiService.getData('servicePrograms/' + this.programID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.programName = result.programName;
        this.repeatByTime = result.repeatByTime;
        this.repeatByOdometer = result.repeatByOdometer;
        this.description = result.description;

        });

  }


  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }


  updateProgram() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      'programID': this.programID,
      'programName': this.programName,
      'repeatByTime' : this.repeatByTime,
      'repeatByOdometer': this.repeatByOdometer,
      'description': this.description,
    };

    this.apiService.putData('servicePrograms', data)
      .subscribe({
        complete : () => {},
        error : (err) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/'.*'/, 'This Field');
                this.errors[val.context.key] = val.message;
              }),
            )
            .subscribe((val) => {
              this.throwErrors();
            });

        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          this.Success = 'Service Program Updated successfully';
        }
      });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }


}
