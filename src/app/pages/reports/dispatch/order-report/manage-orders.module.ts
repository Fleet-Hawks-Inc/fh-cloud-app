import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxSpinnerModule } from "ngx-spinner";
import { RouterModule, Routes } from "@angular/router";
import { OverviewComponent } from "./overview/overview.component";
import { SummaryComponent } from "./summary/summary.component";
import { DetailreportComponent } from "./detailreport/detailreport.component";
import { CurrencyPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from "primeng/badge";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ChartsModule } from 'ng2-charts';
import { Injectable } from "@angular/core";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../../../../shared/shared.module";
import { HttpClientModule } from "@angular/common/http";





const routes: Routes = [
  { path: "overview", component: OverviewComponent },
  { path: "summary", component: SummaryComponent },
  {
    path: "detailreport",
    component: DetailreportComponent,
    data: { title: "Order Detail Report" },
  },
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
  declarations: [OverviewComponent, SummaryComponent, DetailreportComponent],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    PdfViewerModule,
    ReactiveFormsModule,
    NgbModule,
    NgxSpinnerModule,
    ChartsModule,
    SlickCarouselModule,
    InfiniteScrollModule,
    TableModule,
    MultiSelectModule,
    MenuModule,
    SplitButtonModule,
    AutoCompleteModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    FormsModule,
    BadgeModule,
    OverlayPanelModule
  ],
  providers: [CurrencyPipe],
})
export class ManageOrdersModule {}
