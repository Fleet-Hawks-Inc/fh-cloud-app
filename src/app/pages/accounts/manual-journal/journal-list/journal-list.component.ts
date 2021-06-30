import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import  Constants  from '../../../fleet/constants';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.css']
}) 
export class JournalListComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
  journals = [];
  constructor(private toaster: ToastrService, private accountService: AccountService) { }

  ngOnInit() {
    this.fetchJournals();
  }

  fetchJournals() {
    this.accountService.getData('journal')
      .subscribe((result: any) => {
        if(result.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.journals = result;
      })
  }

  deleteJournal(journalID) {
    this.accountService.getData(`journal/delete/${journalID}`)
      .subscribe((result: any) => {
        this.fetchJournals();
        this.toaster.success('Manual journal deleted successfully.');
      })
  }
}
