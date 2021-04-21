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
  currentUser: any = '';
  carrierName: any;
  isCarrierID: any;
  currentCarrierID = '';
  userRole: any = '';
  carriers: any = [];
  smallName: string;
  carrierBusiness;
  logoSrc: any = 'assets/img/logo.png';
  constructor(private sharedService: SharedServiceService, private apiService: ApiService,
              public router: Router) {
    this.sharedService.activeParentNav.subscribe((val) => {
      let activeTab = localStorage.getItem('active-header');
      if(activeTab != undefined && activeTab != ''){
        val = activeTab;
      }
      this.navSelected = val;

      console.log('this.navSelected',this.navSelected);
    });
  }

  ngOnInit() {
    this.getCurrentuser();
    this.fetchCarrier();
  }

  onNavSelected(nav: string) {
    localStorage.setItem('active-header', nav);
    this.navClicked.emit(nav);
    this.sharedService.activeParentNav.next(nav);
  }
fetchCarrier(){
  this.apiService.getData('carriers/getCarrier')
      .subscribe((result: any) => {
        if(result.Items.length > 0){
          this.carriers = result.Items[0];
          this.currentCarrierID = this.carriers.carrierID;
          this.logoSrc = 'assets/img/logo.png';
          // console.log("this.carriers",this.carriers)
          // this.logoSrc = `${this.Asseturl}/${this.carriers.carrierID}/${this.carriers.uploadedLogo}`;
          // if(this.logoSrc === undefined || this.logoSrc === null || this.logoSrc === '' || this.logoSrc === 'undefined') {
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
    localStorage.removeItem('carrierID')
    localStorage.removeItem('active-header');

    // localStorage.removeItem('jwt');
    this.router.navigate(['/Login']);

  }

  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.userRole = this.currentUser.userType;
    this.currentUser = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    let outputName = this.currentUser.match(/\b(\w)/g);
    this.smallName = outputName.join('');
  }
  
}
