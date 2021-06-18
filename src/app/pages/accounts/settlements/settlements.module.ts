import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettlementsListComponent } from './settlements-list/settlements-list.component';
import { SettlementsDetailComponent } from './settlements-detail/settlements-detail.component';
import { AddSettlementComponent } from './add-settlement/add-settlement.component';


const routes: Routes = [
  { path: 'list', component: SettlementsListComponent },
  { path: 'add', component: AddSettlementComponent },
  { path: 'detail', component: SettlementsDetailComponent },
];
@NgModule({
  declarations: [
    SettlementsListComponent,
    SettlementsDetailComponent,
    AddSettlementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SettlementsModule { }
