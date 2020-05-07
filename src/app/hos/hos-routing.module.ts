import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryComponent } from "./compliance/summary/summary.component";


const routes: Routes = [
  {
    path: "compliance",
    children: [
      { path: "summary", component: SummaryComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HosRoutingModule { }
