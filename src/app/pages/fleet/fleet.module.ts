import {Injectable, NgModule} from '@angular/core';
import { FleetRoutingModule } from './fleet-routing.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ChartsModule} from 'ng2-charts';
// ngselect2
import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ɵs } from '@ng-select/ng-select';

import { SlickCarouselModule } from 'ngx-slick-carousel';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { DashboardDriverComponent } from './index';

const COMPONENTS = [
  DashboardDriverComponent,
];




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
      day: + parseInt(parts[2]) }
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
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
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
    FleetRoutingModule,
    FormsModule,
    CommonModule,
    SharedModule,
    ChartsModule,
    SlickCarouselModule,
    NgSelectModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule,
    
  ],
  exports: [...COMPONENTS],
  declarations: [
    ...COMPONENTS,

  ],
  providers: [NgSelectConfig, ɵs,
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
  ],
})
export class FleetModule {}
