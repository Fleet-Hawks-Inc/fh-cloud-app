import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SharedServiceService} from '../../services/shared-service.service';
import {Auth} from 'aws-amplify';
import {Router} from '@angular/router';
import { ApiService } from 'src/app/services';
import { InvokeHeaderFnService } from 'src/app/services/invoke-header-fn.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  @Output() navClicked = new EventEmitter<any>();
  navSelected = '';
  currentUser: any = '';
  carrierName: any;
  isCarrierID: any;
  currentCarrierID = '';
  userRole: any = '';
  carriers: any = [];
  smallName: string;
  carrierBusiness;
  currentUserName = '';
  nickName = '';
  logoSrc: any = 'assets/img/logo.png';
  constructor(private sharedService: SharedServiceService, private apiService: ApiService,
              public router: Router, private headerFnService: InvokeHeaderFnService) {
    this.sharedService.activeParentNav.subscribe((val) => {
      let activeTab = localStorage.getItem('active-header');
      if(activeTab != undefined && activeTab != ''){
        val = activeTab;
      }
      this.navSelected = val;

      console.log('this.navSelected', this.navSelected);
    });
  }

  ngOnInit() {
    this.getCurrentuser();
    this.fetchCarrier();
    if (this.headerFnService.subsVar === undefined) {
      this.headerFnService.subsVar = this.headerFnService.
      invokeHeaderComponentFunction.subscribe((name: string) => {
        this.upateCurrentUser();
      });
    }
  }

  onNavSelected(nav: string) {
    localStorage.setItem('active-header', nav);
    this.navClicked.emit(nav);
    this.sharedService.activeParentNav.next(nav);
  }
fetchCarrier() {
  this.apiService.getData('carriers/getCarrier')
      .subscribe((result: any) => {
        if(result.Items.length > 0){
          this.carriers = result.Items[0];
          this.currentCarrierID = this.carriers.carrierID;
          this.logoSrc = 'assets/img/logo.png';
          // if (this.carriers.uploadedLogo !== '') {
          //   this.logoSrc = `${this.Asseturl}/${this.carriers.carrierID}/${this.carriers.uploadedLogo}`;
          // } else {
          //   this.logoSrc = 'assets/img/logo.png';
          // }
        }
      });
}

  Logout() {
    console.log('logout');
    Auth.signOut();
    localStorage.removeItem('LoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('active-header');
    localStorage.removeItem('carrierID');
    localStorage.removeItem('loggin-carrier');
    localStorage.removeItem('issueVehicleID');
    localStorage.removeItem('carrierID');
    localStorage.removeItem('active-header');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('nickName');
    localStorage.setItem('signOut', 'true'); //trigger flag
    localStorage.removeItem('accessToken'); //Remove token from local
    // localStorage.removeItem('jwt');
    this.router.navigate(['/Login']);
  }

  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.userRole = this.currentUser.userType;
    localStorage.setItem('currentUsername', this.currentUser.username);
    this.currentUser = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    const outputName = this.currentUser.match(/\b(\w)/g);
    this.smallName = outputName.join('');
    localStorage.setItem('currentUserName', this.currentUser);
    localStorage.setItem('nickName', this.smallName);
    this.currentUserName = localStorage.getItem('currentUserName');
    this.nickName = localStorage.getItem('nickName');
  }
upateCurrentUser() {
  this.currentUserName = localStorage.getItem('currentUserName');
  this.nickName = localStorage.getItem('nickName');
}
}
