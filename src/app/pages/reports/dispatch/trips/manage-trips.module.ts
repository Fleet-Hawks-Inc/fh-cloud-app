import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { SummaryComponent } from './summary/summary.component';
import { TripsDetailComponent } from './trips-detail/trips-detail.component';
import { TripsActivityComponent } from './trips-activity/trips-activity.component';




const routes: Routes = [
  { path: 'overview', component: OverviewComponent  },
  { path: 'summary', component: SummaryComponent  },
  { path: 'detail', component: TripsDetailComponent  },
  { path: 'activity', component: TripsActivityComponent  },

]

@NgModule({
  declarations: [

  OverviewComponent,
  SummaryComponent,
  TripsDetailComponent,
  TripsActivityComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageTripsModule { }
