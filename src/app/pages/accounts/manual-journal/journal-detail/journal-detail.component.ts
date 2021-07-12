import { Component, OnInit } from '@angular/core';
import { AccountService, ApiService } from '../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-journal-detail',
  templateUrl: './journal-detail.component.html',
  styleUrls: ['./journal-detail.component.css']
})
export class JournalDetailComponent implements OnInit {

  journalID;
  journal = {
    txnDate: null,
    referenceNo: '',
    currency: null,
    notes: '',
    details: [{
      accountID: null,
      description: '',
      contactID: null,
      debit: 0,
      credit: 0
    }],
    debitTotalAmount: 0,
    creditTotalAmount: 0,
  };
  contacts = [];
  accounts = [];
  Asseturl = this.apiService.AssetUrl;
  carrierID = '';
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');
  documentSlides = [];

  constructor(private accountService: AccountService, private router: Router, private route: ActivatedRoute, private apiService: ApiService, private domSanitizer: DomSanitizer, private toaster: ToastrService) { }

  ngOnInit() {
    this.journalID = this.route.snapshot.params['journalID'];
    this.fetchJournalByID();
    this.fetchContacts();
    this.fetchAccounts();
  }

  fetchJournalByID() {
    this.accountService.getData(`journal/${this.journalID}`)
      .subscribe((result: any) => {
        if(result[0] != undefined) {
          this.journal = result[0];

          if (result[0].attachments != undefined && result[0].attachments.length > 0) {
            result[0].attachments.map((x) => {
              let obj = {
                name: x,
                path: `${this.Asseturl}/${result[0].carrierID}/${x}`
              }
              this.documentSlides.push(obj);
            })
          }
        }
      })
  }

  fetchContacts() {
    this.apiService.getData(`contacts/get/list`)
      .subscribe((result: any) => {
        this.contacts = result;
      })
  }

  fetchAccounts() {
    this.accountService.getData(`chartAc/get/list/all`)
      .subscribe((result: any) => {
        this.accounts = result;
      })
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length - 1];
    this.pdfSrc = '';
    if (ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  deleteDocument(name: string, index: number) {
    this.accountService.deleteData(`journal/uploadDelete/${this.journalID}/${name}`).subscribe((result: any) => {
      this.documentSlides.splice(index, 1);
      this.toaster.success('Attachment deleted successfully.');
    }); 
  }
}
