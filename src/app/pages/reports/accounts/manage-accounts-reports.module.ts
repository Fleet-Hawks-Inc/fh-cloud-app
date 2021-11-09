import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component'
import { CustomerCollectionComponent } from './customer-collection/customer-collection.component'

const routes: Routes = [
    { path: 'overview', component: OverviewComponent },
    { path: 'collections', component: CustomerCollectionComponent },
]

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ]
})
export class ManageAccountsReportsModule { }