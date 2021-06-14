import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AccountsRoutingModule } from './accounts-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule,
    NgSelectModule
  ]
})
export class AccountsModule { }
