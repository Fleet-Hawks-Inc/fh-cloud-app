import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  title = 'User List';
  users;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchUsers();

  }

  fetchUsers() {
    this.apiService.getData('users/userType/manager')
        .subscribe((result: any) => {
          this.users = result.Items;
        });
  }


  deleteUser(userId) {
    this.apiService.deleteData('users/' + userId)
        .subscribe((result: any) => {
          this.fetchUsers();
        })
  }

}
