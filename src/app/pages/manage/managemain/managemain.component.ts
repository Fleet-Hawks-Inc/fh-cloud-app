import { Component, OnInit } from '@angular/core';
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';

@Component({
  selector: 'app-managemain',
  templateUrl: './managemain.component.html',
  styleUrls: ['./managemain.component.css']
})
export class ManagemainComponent implements OnInit {
  sessionID: string;

  constructor(
  private routerMgmtService: RouteManagementServiceService
  ) { 
        this.sessionID = this.routerMgmtService.serviceLogSessionID;
  }

  ngOnInit() {
  }

}
