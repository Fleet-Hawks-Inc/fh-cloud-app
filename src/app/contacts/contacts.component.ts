import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  title = 'Contacts List';
  contacts;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchContacts();

  }

  fetchContacts() {
    this.apiService.getData('contacts')
        .subscribe((result: any) => {
          this.contacts = result.Items;
        });
  }



  deleteContact(contactID) {
    this.apiService.deleteData('contacts/' + contactID)
        .subscribe((result: any) => {
          this.fetchContacts();
        })
  }

}
