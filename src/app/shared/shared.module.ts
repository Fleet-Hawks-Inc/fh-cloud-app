import { CommonModule } from '@angular/common';
import { NgModule, Injectable } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MultiSidebarComponents } from './sidebars/multi-sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FixedRightSidebarComponent } from './sidebars/fixed-right-sidebar/fixed-right-sidebar.component';
import { SharedModalsComponent } from './popups/shared-modals/shared-modals.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogModule } from 'primeng/dialog';
import { SlickCarouselModule } from 'ngx-slick-carousel';
// ngselect2
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ɵs } from '@ng-select/ng-select';
import { AddServiceProgramComponent } from '../pages/fleet/maintenance/service-program/add-service-program/add-service-program.component';
import { AllCarriersComponent } from './all-carriers/all-carriers.component';
import { MustMatchDirective } from '../directives/must-match.directive';
import { AbsoluteValuePipe } from '../pipes/absolute-value.pipe';
import { NewAddressBookComponent } from './popups/new-address-book/new-address-book.component';
import { BadgeModule } from 'primeng/badge';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { PaymentChequeComponent } from './payment-cheque/payment-cheque.component';
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
    return date ? date.year + this.DELIMITER + ('0' + date.month).slice(-2)
      + this.DELIMITER + ('0' + date.day).slice(-2) : null
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
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : '';
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgSelectModule,
    NgbModule,
    SlickCarouselModule,
    InfiniteScrollModule,
    DragDropModule,
    BadgeModule,
    OverlayPanelModule,
    DialogModule,
    TabViewModule,
    TableModule,
    ButtonModule,
    SidebarModule
  ],
  declarations: [
    SidebarComponent,
    MultiSidebarComponents,
    HeaderComponent,
    FixedRightSidebarComponent,
    AddServiceProgramComponent,
    SharedModalsComponent,
    AllCarriersComponent,
    MustMatchDirective,
    AbsoluteValuePipe,
    NewAddressBookComponent,
    PaymentChequeComponent

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    SidebarComponent,
    MultiSidebarComponents,
    HeaderComponent,
    SidebarComponent,
    FixedRightSidebarComponent,
    MustMatchDirective,
    AbsoluteValuePipe,
    PaymentChequeComponent
  ],
  providers: [NgSelectConfig, ɵs,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class SharedModule {
}
