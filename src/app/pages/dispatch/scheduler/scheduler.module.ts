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

const routes: Routes = [
    {
      path: "scheduler-list/:sessionId",
      component: SchedulerListComponent,
      data: {
        reuseRoute: true,
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
        NgbModule
    ]

})
export class SchedularModule{}