import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {SharedModule} from '../../../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { QuotesListComponent } from './quotes-list/quotes-list.component';
import { AddQuotesComponent } from './add-quotes/add-quotes.component';
import { QuoteDetailComponent } from './quote-detail/quote-detail.component';

const routes: Routes = [
  { path: '', component: QuotesListComponent},
  { path: 'add', component: AddQuotesComponent},
  { path: 'edit/:quoteID', component: AddQuotesComponent},
  { path: 'detail/:quoteID', component: QuoteDetailComponent }
];
@NgModule({
  declarations: [
    QuotesListComponent,
    AddQuotesComponent,
    QuoteDetailComponent
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
  ],
  providers: []
})
export class QuoteModule {}
