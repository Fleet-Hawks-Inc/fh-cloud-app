import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PdetailComponent } from './pdetail/pdetail.component';



const routes: Routes = [
  { path: 'detail', component: PdetailComponent  },
]

@NgModule({
  declarations: [

  PdetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManagePlannerReportModule { }
