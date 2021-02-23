import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
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
      this.active_nav = val;
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
    console.log('clicked');
    localStorage.removeItem('LoggedIn');
    localStorage.removeItem('jwt');
    this.router.navigate(['/Login']);
  }

  // @Input()
  // navClicked($data) {
  //   console.log($data);
  //   this.active_nav = $data;
  // }


}
