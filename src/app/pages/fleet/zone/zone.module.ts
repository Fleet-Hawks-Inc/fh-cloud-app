import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule,Routes} from '@angular/router'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { unsavedChangesGuard } from 'src/app/guards/unsaved-changes.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { ZoneAddComponent } from './zone-add/zone-add.component';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from "primeng/badge";
import { NgSelectModule } from "@ng-select/ng-select";

const routes: Routes = [
    { path: 'add', component: ZoneAddComponent },
    { path: 'list', component: ZoneListComponent},
  ];

  @NgModule({
      declarations:[
          ZoneAddComponent,
          ZoneListComponent
      ],
      imports:[
          CommonModule,
          SharedModule,
          RouterModule.forChild(routes),
          HttpClientModule,
          FormsModule,
          NgbModule,
          ReactiveFormsModule,
          NgxSpinnerModule,
          TableModule,
          MenuModule,
          DropdownModule,
          ButtonModule,
          ToastModule,
          BadgeModule,
          NgSelectModule
      ],
      providers:[unsavedChangesGuard]
  })
  export class ZoneModule{ }