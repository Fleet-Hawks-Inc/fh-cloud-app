import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component'
import { CustomerCollectionComponent } from './customer-collection/customer-collection.component'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


const routes: Routes = [
    { path: 'overview', component: OverviewComponent },
    { path: 'collections', component: CustomerCollectionComponent },
]

@NgModule({
    declarations: [OverviewComponent, CustomerCollectionComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgxDatatableModule,
        NgbModule,
        FormsModule

    ]
})
export class ManageAccountsReportsModule { }