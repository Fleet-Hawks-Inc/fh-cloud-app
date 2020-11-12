import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.fetchLogs();
  }


  fetchLogs() {
    // this.spinner.show();
    this.apiService.getData('serviceLogs').subscribe({
      complete: () => {},
      error: () => { },
      next: (result: any) => {
        console.log(result);
        
      },
    });
  }
}
