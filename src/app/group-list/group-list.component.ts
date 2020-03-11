import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  title = 'Group List';
  groups;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchGroups();

  }

  fetchGroups() {
    this.apiService.getData('groups')
        .subscribe((result: any) => {
          this.groups = result.Items;
        });
  }



  deleteGroup(groupId) {
    this.apiService.deleteData('groups/' + groupId)
        .subscribe((result: any) => {
          this.fetchGroups();
        })
  }

}
