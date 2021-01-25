import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SharedServiceService} from '../../services/shared-service.service';
import {Auth} from 'aws-amplify';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() navClicked = new EventEmitter<any>();
  navSelected = '';
  currentUser:any = '';
  userRole:any = '';
  constructor(private sharedService: SharedServiceService,
              public router: Router) {
    this.sharedService.activeParentNav.subscribe((val) => {
      this.navSelected = val;
    });
  }

  ngOnInit() {
    this.getCurrentuser()
  }

  onNavSelected(nav: string) { 
    this.navClicked.emit(nav);
    this.sharedService.activeParentNav.next(nav);
  }

  Logout() {
    console.log('logout');
    Auth.signOut();
    localStorage.removeItem('LoggedIn');
    localStorage.removeItem('user');
    // localStorage.removeItem('jwt');
    this.router.navigate(['/Login']);
  }

  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.userRole = this.currentUser.userType;
    this.currentUser = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }

}
