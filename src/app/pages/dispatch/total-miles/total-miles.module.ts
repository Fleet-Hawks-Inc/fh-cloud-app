import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalMilesComponent } from './total-miles/total-miles.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
{ path: 'total-miles', component: TotalMilesComponent }
]
@NgModule({
  declarations: [
    TotalMilesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgSelectModule,
  ]
})
export class TotalMilesModule { }
