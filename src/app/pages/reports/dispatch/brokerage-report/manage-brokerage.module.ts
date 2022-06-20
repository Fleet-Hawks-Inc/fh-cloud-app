import { NgModule, Injectable } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { CurrencyPipe } from "@angular/common";
import { ToastrModule } from "ngx-toastr";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BoverviewComponent } from './boverview/boverview.component';
import { BrokerageComponent } from './brokerage/brokerage.component';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SharedModule} from "../../../../shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxSpinnerModule } from "ngx-spinner";
import { ChartsModule } from "ng2-charts";
//import { unsavedChangesGuard } from "src/app/guards/unsaved-changes.guard";
import { GoogleMapsModule } from "@angular/google-maps";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';


const routes: Routes = [
  { path: "boverview", component: BoverviewComponent },
  { path: "brokerage", component: BrokerageComponent },
];




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

  toModel(date: NgbDateStruct): string { // from internal model -> your mode
    return date
      ? date.year +
          this.DELIMITER +
          ("0" + date.month).slice(-2) +
          this.DELIMITER +
          ("0" + date.day).slice(-2)
      : null;
  }
}

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
    return date
      ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day
      : "";
  }
}







@NgModule({
  declarations: [BoverviewComponent, BrokerageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    FormsModule,
    ToastrModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    NgxSpinnerModule,
    ChartsModule,
    NgxDatatableModule,
    GoogleMapsModule,
    InfiniteScrollModule,
    TableModule,
    ButtonModule,
    MultiSelectModule,
    TooltipModule,
    MenuModule,
    SplitButtonModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule
  ],
  providers: [CurrencyPipe,
   { provide: NgbDateAdapter, useClass: CustomAdapter },
    ],
})
export class ManageBrokerageModule { }
