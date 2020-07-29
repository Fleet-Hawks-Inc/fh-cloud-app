import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {SidebarComponent} from './sidebar/sidebar.component';
import { MultiSidebarComponents } from './sidebars/multi-sidebar.component';
import {HeaderComponent} from './header/header.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  declarations: [
    SidebarComponent,
    MultiSidebarComponents,
    HeaderComponent,
    
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    SidebarComponent,
    MultiSidebarComponents,
    HeaderComponent,

  ]
})
export class SharedModule {}
