import { Injectable, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddTransferComponent } from "./transfers/add-transfer/add-transfer.component";
import { TransfersListComponent } from "./transfers/transfers-list/transfers-list.component";
import { TransfersDetailComponent } from "./transfers/transfers-detail/transfers-detail.component";
import { RouterModule, Routes } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModule } from "@ng-bootstrap/ng-bootstrap";

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
 @Injectable()
 export class CustomAdapter extends NgbDateAdapter<string> {
   readonly DELIMITER = "-";
 
   fromModel(value: string): NgbDateStruct {
     if (!value) {
       return null;
     }
     let parts = value.split(this.DELIMITER);
     return {
       year: +parseInt(parts[0]),
       month: +parseInt(parts[1]),
       day: +parseInt(parts[2]),
     };
   }
 
   toModel(date: NgbDateStruct): string {
     // from internal model -> your mode
     let month: any = "";
     let day: any = "";
     if (date) {
       month = date.month < 10 ? "0" + date.month : date.month;
       day = date.day < 10 ? "0" + date.day : date.day;
     }
     return date
       ? date.year + this.DELIMITER + month + this.DELIMITER + day
       : null;
   }
 }
 
 /**
  * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
  */
 @Injectable()
 export class CustomDateParserFormatter extends NgbDateParserFormatter {
   readonly DELIMITER = "/";
 
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
     let month: any = "";
     let day: any = "";
     if (date) {
       month = date.month < 10 ? "0" + date.month : date.month;
       day = date.day < 10 ? "0" + date.day : date.day;
     }
 
     return date
       ? date.year + this.DELIMITER + month + this.DELIMITER + day
       : "";
   }
 }

const routes: Routes = [
  {
    path: "transfers/list",
    component: TransfersListComponent,
    data: { title: "Transfers List" },
  },
  {
    path: "transfers/add",
    component: AddTransferComponent,
    data: { title: "Add Transfer" },
  },
  {
    path: "transfers/edit/:transferID",
    component: AddTransferComponent,
    data: { title: "Edit Transfer" },
  },
  {
    path: "transfers/detail/:transferID",
    component: TransfersDetailComponent,
    data: { title: "Transfer Detail" },
  },
];

@NgModule({
  declarations: [
    AddTransferComponent,
    TransfersListComponent,
    TransfersDetailComponent,
  ],
  imports: [
    CommonModule, 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule, 
    RouterModule.forChild(routes)
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class TransactionsModule {}
