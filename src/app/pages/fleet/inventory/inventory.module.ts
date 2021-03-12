import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {SharedModule} from '../../../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import {ChartsModule} from 'ng2-charts';
import { unsavedChangesGuard } from 'src/app/guards/unsaved-changes.guard';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryDetailComponent } from './inventory-detail/inventory-detail.component';

const routes: Routes = [
  { path: 'add', component: AddInventoryComponent },
  { path: 'edit/:itemID', component: AddInventoryComponent },
  { path: 'list', component: InventoryListComponent },
  { path: 'detail/:itemID', component: InventoryDetailComponent },
];
@NgModule({
  declarations: [
    AddInventoryComponent,
    InventoryListComponent,
    InventoryDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxSpinnerModule,
    ChartsModule
  ],
  providers: [unsavedChangesGuard]
})
export class InventroysModule {}
