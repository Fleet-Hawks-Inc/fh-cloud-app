import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-service-program-list',
  templateUrl: './service-program-list.component.html',
  styleUrls: ['./service-program-list.component.css']
})
export class ServiceProgramListComponent implements OnInit {

  title = 'Service Program List';
  programs;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.fetchPrograms();
  }

  fetchPrograms() {
    this.apiService.getData('servicePrograms')
      .subscribe((result: any) => {
        this.programs = result.Items;
      });
  }

  deleteProgram(programId) {
    this.apiService.deleteData('servicePrograms/' + programId)
      .subscribe((result: any) => {
        this.fetchPrograms();
      })
  }

}
