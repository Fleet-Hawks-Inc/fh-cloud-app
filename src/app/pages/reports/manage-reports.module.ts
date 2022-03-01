import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AllReportsComponent } from "../reports/all-reports/all-reports.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
const routes: Routes = [
  {
    path: "allreport",
    component: AllReportsComponent,
  },
  {
    path: "fleet",
    loadChildren: () =>
      import("./fleet/manage-fleet-reports.module").then(
        (m) => m.ManageFleetReportsModule
      ),
    data: { title: "Fleet Reports" },
  },
  {
    path: "dispatch",
    loadChildren: () =>
      import("./dispatch/manage-dispatch-reports.module").then(
        (m) => m.ManageDispatchReportsModule
      ),
    data: { title: "Routing & Dispatch Reports" },
  },
  {
    path: "safety",
    loadChildren: () =>
      import("./safety/manage-safety-reports.module").then(
        (m) => m.ManageSafetyReportsModule
      ),
    data: { title: "Safety Reports" },
  },
  {
    path: "compliance",
    loadChildren: () =>
      import("./compliance-reports/manage-compliance-reports.module").then(
        (m) => m.ManageComplianceReportsModule
      ),
    data: { title: "Compliance Reports" },
  },
  {
    path: "accounts",
    loadChildren: () =>
      import("./accounts/manage-accounts-reports.module").then(
        (m) => m.ManageAccountsReportsModule
      ),
    data: { title: "Accounts Reports" },
  },
  {
    path: "addressbook",
    loadChildren: () =>
      import("./address-book/mange-address-book.module").then(
        (m) => m.ManageAddressBookModule
      ),
    data: { title: "Addressbook Reports" },
  },
];

@NgModule({
  declarations: [AllReportsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), NgxDatatableModule],
})
export class ManageReportsModule {}
