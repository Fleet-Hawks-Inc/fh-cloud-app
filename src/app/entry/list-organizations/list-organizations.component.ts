import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-organizations',
  templateUrl: './list-organizations.component.html',
  styleUrls: ['./list-organizations.component.css']
})
export class ListOrganizationsComponent implements OnInit {

  currentUser:any = {};
  organizations = [];
  constructor(private apiService: ApiService, private router: Router,) { }

  async ngOnInit() {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.apiService.getData(`carriers/get/organizations/${this.currentUser.carrierID}`).subscribe((res) => {
      this.organizations = res;
    })
  }

  switchDashboard(data) {
    localStorage.setItem('xfhCarrierId', data.carrierID);
    localStorage.setItem("currentUserName", `${data.firstName} ${data.lastName}`);
    this.router.navigate(['/Map-Dashboard'])
  }
}
