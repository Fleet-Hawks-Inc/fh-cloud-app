import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OverviewroutesComponent } from './overviewroutes/overviewroutes.component';


const routes: Routes = [
  { path: 'overviewroutes', component: OverviewroutesComponent  },
]

@NgModule({
  declarations: [

  OverviewroutesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageRoutesReportModule { }
