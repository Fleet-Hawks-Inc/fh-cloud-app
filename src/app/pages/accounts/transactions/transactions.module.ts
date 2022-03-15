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
    data: { title: "Add Transfer" },
  },
  {
    path: "transfers/detail",
    component: TransfersDetailComponent,
    data: { title: "Transfer Detail" },
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
