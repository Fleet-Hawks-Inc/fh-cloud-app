import { NgModule } from "@angular/core";
import {RouterModule, Routes} from "@angular/router"
import { SchedulerListComponent } from "./scheduler-list/scheduler-list.component";
import { SchedulerDetailsComponent } from "./scheduler-details/scheduler-details.component";
import { AddSchedulerComponent } from "./add-scheduler/add-scheduler.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from "primeng/badge";
import { NgSelectModule } from "@ng-select/ng-select";
import { OverlayPanelModule } from 'primeng/overlaypanel';


const routes: Routes = [
    {
      path: "scheduler-list",
      component: SchedulerListComponent,
      data: {
        title: "Schedule List",
      },
    },
    {
      path: "edit/:scheduleID",
      component: AddSchedulerComponent,
      data: { title: "Edit Schedule" },
    },
    { path: "add", component: AddSchedulerComponent, data: { title: "Add Schedule" } },
    {
      path: "detail/:scheduleID",
      component: SchedulerDetailsComponent,
      data: { title: "Detail Schedule" },
    }
  ];
@NgModule({
    declarations:[
        SchedulerDetailsComponent,
        SchedulerListComponent,
        AddSchedulerComponent
    ],
    imports:[
        CommonModule,
        SharedModule,RouterModule.forChild(routes),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        TableModule,
        MenuModule,
        SplitButtonModule,
        AutoCompleteModule,
        DropdownModule,
        ButtonModule,
        ToastModule,
        FormsModule,
        BadgeModule,
        NgSelectModule,
        OverlayPanelModule
    ]

})
export class SchedularModule{}