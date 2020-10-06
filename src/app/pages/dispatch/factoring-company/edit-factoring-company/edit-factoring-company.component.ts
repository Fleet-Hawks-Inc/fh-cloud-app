import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import {  ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-edit-factoring-company',
  templateUrl: './edit-factoring-company.component.html',
  styleUrls: ['./edit-factoring-company.component.css']
})
export class EditFactoringCompanyComponent implements OnInit {

  title = 'Edit Factoring Company';
  errors = {};
  form;
  concatArrayKeys = '';


  /********** Form Fields ***********/
  factoringCompanyID = '';
  factoringCompanyName = '';
  phone = '';
  email = '';
  fax = '';

  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';

  constructor(private apiService: ApiService,
    private route: ActivatedRoute
  ) { }


  ngOnInit() {
   this.factoringCompanyID = this.route.snapshot.params['factoringCompanyID'];
    this.fetchFactoringCompany();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }
  fetchFactoringCompany(){
    this.apiService.getData('factoringCompanies/' + this.factoringCompanyID)
    .subscribe((result: any) => {
      //console.log(result);
      result = result.Items[0];
      this.factoringCompanyName = result.factoringCompanyName;
      this.phone =  result.phone;
      this.email =  result.email;
      this.fax = result.fax;

    });
  }

  updateFactoringCompany() {
    this.errors = {};

    this.hasError = false;
    this.hasSuccess = false;

    const dataFactoringCompany = {
      factoringCompanyName: this.factoringCompanyName,
      phone: this.phone,
      email: this.email,
      fax : this.fax,

    };
     console.log('Factoring Company Data',dataFactoringCompany);


     this.apiService.putData('factoringCompanies', dataFactoringCompany).
    subscribe({
      complete : () => {},
      error : (err) =>  {
        from(err.error)
          .pipe(
            map((val: any) => {
                const path = val.path;
                // We Can Use This Method
                const key = val.message.match(/'([^']+)'/)[1];
                val.message = val.message.replace(/'.*'/, 'This Field');
                this.errors[key] = val.message;
              }),
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => {},
            next: () => {}
          });
        },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Factoring Company Updated Successfully';

        this.factoringCompanyName = '';
        this.fax = '';
        this.phone = '';
        this.email = '';

      }
    });


  }
  throwErrors() {
    this.form.showErrors(this.errors);
  }

  concatArray(path) {
    this.concatArrayKeys = '';
    for (const i in path) {
        this.concatArrayKeys += path[i] + '.';
    }
    this.concatArrayKeys = this.concatArrayKeys.substring(0, this.concatArrayKeys.length - 1);
    return this.concatArrayKeys;
  }
}
