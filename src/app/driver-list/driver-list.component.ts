import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {
  title = 'Driver List';
  users = [];

  constructor(private apiService: ApiService,
    private router: Router) { }


    ngOnInit() {
      this.fetchUsers();
    }
  
    fetchUsers() {
      this.apiService.getData('users/userType/driver')
          .subscribe((result: any) => {
            this.users = result.Items;
          });
    }
  
    deleteUser(userName) {
      this.apiService.deleteData('users/' + userName)
          .subscribe((result: any) => {
            this.fetchUsers();
          })
    }

}
