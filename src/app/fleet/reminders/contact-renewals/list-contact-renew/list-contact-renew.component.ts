import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-contact-renew',
  templateUrl: './list-contact-renew.component.html',
  styleUrls: ['./list-contact-renew.component.css']
})
export class ListContactRenewComponent implements OnInit {
  filterData = ['Conntact 1','Contact 2'];

  selectedAssets;
  constructor() { }

  ngOnInit() {
  }

}
