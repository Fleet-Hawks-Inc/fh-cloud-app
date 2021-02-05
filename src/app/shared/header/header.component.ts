import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SharedServiceService} from '../../services/shared-service.service';
import {Auth} from 'aws-amplify';
import {Router} from '@angular/router';
import { ApiService } from 'src/app/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  @Output() navClicked = new EventEmitter<any>();
  navSelected = '';
  currentUser:any = '';
  userRole:any = '';
  carriers: any = [];
  logoSrc: any = 'assets/img/logo.png';
  constructor(private sharedService: SharedServiceService, private apiService: ApiService,
              public router: Router) {
    this.sharedService.activeParentNav.subscribe((val) => {
      this.navSelected = val;
    });
  }

  ngOnInit() {
    this.getCurrentuser();
    this.fetchCarrier();
  }

  onNavSelected(nav: string) { 
    this.navClicked.emit(nav);
    this.sharedService.activeParentNav.next(nav);
  }
fetchCarrier(){
  this.apiService.getData('carriers/getCarrier')
      .subscribe((result: any) => {
        this.carriers = result.Items[0];
        this.logoSrc = `${this.Asseturl}/${this.carriers.carrierID}/${this.carriers.uploadedLogo}`;
        if(this.logoSrc == undefined || this.logoSrc == null || this.logoSrc == '') {
          this.logoSrc = 'assets/img/logo.png';
        }
      });
}

  Logout() {
    console.log('logout');
    Auth.signOut();
    localStorage.removeItem('vehicle');
    localStorage.removeItem('driver');
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
