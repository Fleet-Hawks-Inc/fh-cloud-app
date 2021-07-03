import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { IncomeListComponent } from './income-list/income-list.component';
import { AddIncomeComponent } from './add-income/add-income.component';
import { IncomeDetailComponent } from './income-detail/income-detail.component';
import { AddAccountModule } from '../add-account/add-account.module';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
 @Injectable()
 export class CustomAdapter extends NgbDateAdapter<string> {
 
   readonly DELIMITER = '-';
 
   fromModel(value: string): NgbDateStruct {
     if (!value)
       return null
     let parts = value.split(this.DELIMITER);
     return {
       year: + parseInt(parts[0]),
       month: + parseInt(parts[1]),
       day: + parseInt(parts[2])
     }
   }
 
   toModel(date: NgbDateStruct): string // from internal model -> your mode
   {
     let month: any = '';
     let day: any = '';
     if (date) {
       month = (date.month < 10) ? '0' + date.month : date.month;
       day = (date.day < 10) ? '0' + date.day : date.day;
     }
     return date ? date.year + this.DELIMITER + month + this.DELIMITER + day : null;
   }
 }
 
 /**
  * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
  */
 @Injectable()
 export class CustomDateParserFormatter extends NgbDateParserFormatter {
 
   readonly DELIMITER = '/';
 
   parse(value: string): NgbDateStruct | null {
     if (value) {
       const date = value.split(this.DELIMITER);
       return {
         year: parseInt(date[2], 10),
         month: parseInt(date[1], 10),
         day: parseInt(date[0], 10),
 
       };
     }
     return null;
   }
 
   format(date: NgbDateStruct | null): string {
     let month: any = '';
     let day: any = '';
     if (date) {
       month = (date.month < 10) ? '0' + date.month : date.month;
       day = (date.day < 10) ? '0' + date.day : date.day;
     }
 
     return date ? date.year + this.DELIMITER + month + this.DELIMITER + day : '';
   }
 }

const routes: Routes = [ 
  { path: 'list', component: IncomeListComponent},
  { path: 'add', component: AddIncomeComponent},
  { path: 'detail/:incomeID', component: IncomeDetailComponent}, 
  { path: 'edit/:incomeID', component: AddIncomeComponent},
];

@NgModule({
  declarations: [IncomeListComponent, AddIncomeComponent, IncomeDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    AddAccountModule
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }]
})
export class IncomeModule { }
