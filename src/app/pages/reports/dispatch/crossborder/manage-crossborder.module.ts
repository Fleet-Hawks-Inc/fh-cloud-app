import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { SummaryComponent } from './summary/summary.component';
import { AceDetailComponent } from './ace-detail/ace-detail.component';
import { AciDetailComponent } from './aci-detail/aci-detail.component';



const routes: Routes = [
  { path: 'overview', component: OverviewComponent  },
  { path: 'summary', component: SummaryComponent  },
  { path: 'acedetail', component: AceDetailComponent  },
  { path: 'acidetail', component: AciDetailComponent  },
]

@NgModule({
  declarations: [

  OverviewComponent,

  SummaryComponent,

  AceDetailComponent,

  AciDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageCrossborderModule { }
