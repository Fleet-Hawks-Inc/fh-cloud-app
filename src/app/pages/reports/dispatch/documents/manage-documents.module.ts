import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';




const routes: Routes = [
  { path: 'summary', component: SummaryComponent  },
  
]

@NgModule({
  declarations: [

SummaryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageDocumentsModule { }
