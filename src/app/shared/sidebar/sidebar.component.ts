import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { filter } from 'rxjs/operators';
import {SharedServiceService} from '../../services/shared-service.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private toggle = false;
  public active_nav = 'fleet';
  public modulePath: any = "";

  constructor(private router: Router,
              private sharedService: SharedServiceService) {

                
    this.sharedService.activeParentNav.subscribe((val) => {
      let activeTab = localStorage.getItem('active-header');
      if(activeTab != undefined && activeTab != ''){
        val = activeTab;
        this.active_nav = val;
      }
      
    });
  }

  ngOnInit() {
    this.modulePath = this.router.url.split('/');
    this.modulePath = this.modulePath[1];
   }

  clickEvent(event) {
    // if you just want to toggle the class; change toggle variable.
    this.toggle = !this.toggle;
  }



  Logout() {
    
    localStorage.removeItem('LoggedIn');
    localStorage.removeItem('jwt');
    this.router.navigate(['/Login']);
  }

  


}
