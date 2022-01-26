import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component'
import { CustomerCollectionComponent } from './customer-collection/customer-collection.component'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import {PaymentReportComponent} from './payment-report/payment-report.component'
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {NgSelectModule} from '@ng-select/ng-select'

const routes: Routes = [
    { path: 'overview', component: OverviewComponent },
    { path: 'collections', component: CustomerCollectionComponent },
    { path: 'payment', component: PaymentReportComponent}
]

@NgModule({
    declarations: [OverviewComponent, CustomerCollectionComponent,PaymentReportComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgxDatatableModule,
        NgbModule,
        FormsModule,
        InfiniteScrollModule,
        NgSelectModule
    ]
})
export class ManageAccountsReportsModule { }