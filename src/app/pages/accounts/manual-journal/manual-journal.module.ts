import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddJournalComponent } from './add-journal/add-journal.component';
import { JournalListComponent } from './journal-list/journal-list.component';
import { JournalDetailComponent } from './journal-detail/journal-detail.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: 'list', component: JournalListComponent},
  { path: 'add', component: AddJournalComponent},
  { path: 'detail', component: JournalDetailComponent},
];


@NgModule({
  declarations: [AddJournalComponent, JournalListComponent, JournalDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ManualJournalModule { }
