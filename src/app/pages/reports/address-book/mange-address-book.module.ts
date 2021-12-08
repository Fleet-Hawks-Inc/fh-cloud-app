import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AddressBookComponent } from './address-book/address-book.component';
import { NgSelectModule } from '@ng-select/ng-select';


const routes: Routes = [
  {path:'', component: AddressBookComponent}
];


@NgModule({
  declarations: [
    AddressBookComponent
    ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NgSelectModule
  ],
  providers: [
    ]
})
export class ManageAddressBookModule { }
