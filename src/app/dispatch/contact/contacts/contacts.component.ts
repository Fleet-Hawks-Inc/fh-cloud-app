import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../api.service";
import {Router} from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  title = 'Contacts List';
  contacts = [];

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchContacts();

  }

  fetchContacts() {
    this.apiService.getData('contacts')
        .subscribe({
          complete: () => {
            this.initDataTable();
          },
          error: () => {},
          next: (result: any) => {
            console.log(result);
            this.contacts = result.Items;
          },
        });
  }
  deleteContact(contactID) {
      
        /******** Clear DataTable ************/
        if ($.fn.DataTable.isDataTable('#datatable-default')) {
          $('#datatable-default').DataTable().clear().destroy();
          }
          /******************************/


    this.apiService.deleteData('contacts/' + contactID)
        .subscribe((result: any) => {
          this.fetchContacts();
        })
  }


  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}
