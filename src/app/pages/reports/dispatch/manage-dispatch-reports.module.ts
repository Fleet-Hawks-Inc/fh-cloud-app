import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "orders",
    loadChildren: () =>
      import("./order-report/manage-orders.module").then(
        (m) => m.ManageOrdersModule
      ),
    data: { title: "Orders Reports" },
  },
   {
    path: "alarm-report",
    loadChildren: () =>
      import("./alarm-report/manage-alarm.module").then(
        (m) => m.ManageAlarmModule
      ),
    data: { title: "Alarm Reports" },
  },
   {
    path: "brokerage-report",
    loadChildren: () =>
      import("./brokerage-report/manage-brokerage.module").then(
        (m) => m.ManageBrokerageModule
      ),
    data: { title: "Brokerage Reports" },
  },
  {
    path: "trips",
    loadChildren: () =>
      import("./trips/manage-trips.module").then((m) => m.ManageTripsModule),
    data: { title: "Trips Reports" },
  },
  {
    path: "routes-report",
    loadChildren: () =>
      import("./routes-report/manage-routes-report.module").then(
        (m) => m.ManageRoutesReportModule
      ),
    data: { title: "Routes Reports" },
  },
  {
    path: "planner-report",
    loadChildren: () =>
      import("./planner-report/manage-planner-report.module").then(
        (m) => m.ManagePlannerReportModule
      ),
    data: { title: "Planner Reports" },
  },
  {
    path: "crossborder",
    loadChildren: () =>
      import("./crossborder/manage-crossborder.module").then(
        (m) => m.ManageCrossborderModule
      ),
    data: { title: "Cross Border Reports" },
  },
  {
    path: "documents",
    loadChildren: () =>
      import("./documents/manage-documents.module").then(
        (m) => m.ManageDocumentsModule
      ),
    data: { title: "Documents Reports" },
  },
];

@NgModule({
  declarations: [
  
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ManageDispatchReportsModule {}
