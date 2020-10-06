import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'app-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.css'],
})
export class EditModelComponent implements OnInit {
  title = 'Edit Model';

  errors = {};
  form;

  /********** Form Fields ***********/

  modelID = '';
  manufacturerID = '';
  name = '';
  yearOfRelease = '';
  timeCreated = '';
  manufacturers = [];

  /******************/

  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.modelID = this.route.snapshot.params['modelID'];
    this.fetchManufacturers();
    this.fetchModel();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  fetchModel() {
    this.apiService
      .getData('models/' + this.modelID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.modelID = result.modelID;
        this.manufacturerID = result.manufacturerID;
        this.name = result.name;
        this.yearOfRelease = result.yearOfRelease;
        this.timeCreated = result.timeCreated;
      });
  }

  fetchManufacturers() {
    this.apiService.getData('manufacturers').subscribe((result: any) => {
      this.manufacturers = result.Items;
    });
  }

  updateModel() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      modelID: this.modelID,
      manufacturerID: this.manufacturerID,
      yearOfRelease: this.yearOfRelease,
      name: this.name,
      timeCreated: this.timeCreated,
    };

    this.apiService.putData('models', data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe((val) => {
            this.throwErrors();
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Model updated successfully';
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
