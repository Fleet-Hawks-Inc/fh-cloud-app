import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AccountsRoutingModule } from './accounts-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartsModule } from 'ng2-charts';
import { HomeComponent } from './home/home.component';
@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule,
    NgSelectModule,
    ChartsModule,
  ]
})
export class AccountsModule { }
