import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddTransferComponent } from "./transfers/add-transfer/add-transfer.component";
import { TransfersListComponent } from "./transfers/transfers-list/transfers-list.component";
import { TransfersDetailComponent } from "./transfers/transfers-detail/transfers-detail.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "transfers/list",
    component: TransfersListComponent,
    data: { title: "Transfers List" },
  },
  {
    path: "transfers/add",
    component: AddTransferComponent,
    data: { title: "Add Transfers List" },
  },
  {
    path: "transfers/detail",
    component: TransfersDetailComponent,
    data: { title: "Transfers List Detail" },
  },
];

@NgModule({
  declarations: [
    AddTransferComponent,
    TransfersListComponent,
    TransfersDetailComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class TransactionsModule {}
