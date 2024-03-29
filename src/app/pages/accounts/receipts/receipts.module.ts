import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddReceiptComponent } from "./add-receipt/add-receipt.component";
import { ReceiptDetailComponent } from "./receipt-detail/receipt-detail.component";
import { ReceiptsListComponent } from "./receipts-list/receipts-list.component";
import { Routes, Router, RouterModule } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Injectable } from "@angular/core";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AddAccountModule } from "../add-account/add-account.module";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = "-";

  fromModel(value: string): NgbDateStruct {
    if (!value) return null;
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
    path: "list/:sessionID",
    component: ReceiptsListComponent,
    data: { title: "Receipts List", reuseRoute: true },
  },
  {
    path: "add",
    component: AddReceiptComponent,
    data: { title: "Add Receipt" },
  },
  {
    path: "detail/:recID",
    component: ReceiptDetailComponent,
    data: { title: "Receipts Detail" },
  },
  {
    path: "edit/:recID",
    component: AddReceiptComponent,
    data: { title: "Edit Receipt" },
  },
];

@NgModule({
  declarations: [
    AddReceiptComponent,
    ReceiptDetailComponent,
    ReceiptsListComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    NgbModule,
    AddAccountModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    TableModule
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class ReceiptsModule { }