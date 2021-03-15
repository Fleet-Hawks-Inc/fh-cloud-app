import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import { AddAssetsComponent } from './add-assets/add-assets.component';
import { AssetListComponent } from './asset-list/asset-list.component';
import { AssetDetailComponent } from './asset-detail/asset-detail.component';
import {SharedModule} from '../../../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import {ChartsModule} from 'ng2-charts';
import { unsavedChangesGuard } from 'src/app/guards/unsaved-changes.guard';

const routes: Routes = [
  { path: 'add', component: AddAssetsComponent, canDeactivate: [unsavedChangesGuard] },
  { path: 'edit/:assetID', component: AddAssetsComponent },
  { path: 'list', component:  AssetListComponent},
  { path: 'detail/:assetID', component: AssetDetailComponent}
];
@NgModule({
  declarations: [
    AddAssetsComponent,
    AssetListComponent,
    AssetDetailComponent,
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
export class AssetsModule {}
