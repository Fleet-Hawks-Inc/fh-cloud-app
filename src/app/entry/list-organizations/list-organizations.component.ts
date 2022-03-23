import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-list-organizations',
  templateUrl: './list-organizations.component.html',
  styleUrls: ['./list-organizations.component.css']
})
export class ListOrganizationsComponent implements OnInit {

  currentUser:any = {};
  organizations = [];
  constructor(private apiService: ApiService) { }

  async ngOnInit() {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    console.log('this.currentUser', this.currentUser);
    this.apiService.getData(`carriers/get/organizations`).subscribe((res) => {
      console.log('res', res)
      this.organizations = res;
    })
  }
}
