import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { SharedServiceService } from "../../services/shared-service.service";
import { Auth } from "aws-amplify";
import { Router } from "@angular/router";
import { ApiService, ListService } from "src/app/services";
import { InvokeHeaderFnService } from "src/app/services/invoke-header-fn.service";
import { environment } from "../../../environments/environment";
import { DashboardUtilityService } from "src/app/services/dashboard-utility.service";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  showNotificationDetail = false;
  isFleetEnabled = environment.isFleetEnabled;
  isDispatchEnabled = environment.isDispatchEnabled;
  isComplianceEnabled = environment.isComplianceEnabled;
  isManageEnabled = environment.isManageEnabled;
  isSafetyEnabled = environment.isSafetyEnabled;
  isAccountsEnabled = environment.isAccountsEnabled;
  isReportsEnabled = environment.isReportsEnabled;
  isAddressBook=environment.isAddressBook;

  Asseturl = this.apiService.AssetUrl;
  @Output() navClicked = new EventEmitter<any>();
  navSelected = "";
  currentUser: any = "";
  carrierName: any;
  isCarrierID: any;
  currentCarrierID = "";
  userRole: any = "";
  carriers: any = [];
  smallName: string;
  carrierBusiness;
  currentUserName = "";
  disabled: boolean = false;
  nickName = "";
  logoSrc: any = "assets/img/logo.png";
  unitData = {
    cName: "",
    dba: "",
    workPhone: "",
    workEmail: "",
    eTypes: [],
    adrs: [
      {
        aType: null,
        cName: "",
        sName: "",
        ctyName: null,
        zip: "",
        add1: "",
        add2: "",
        geoCords: {
          lat: "",
          lng: "",
        },
        userLoc: "",
        manual: false,
        cCode: null,
        sCode: null,
        houseNo: "",
        street: "",
        states: [],
        cities: [],
      },
    ],
    addlCnt: [
      {
        flName: "",
        fName: "",
        lName: "",
        phone: "",
        des: "",
        email: "",
        fax: "",
      },
    ],
    data: [],
  };
  updateButton = false;
  showSwitch = false;

  showNotifications = false;
  notifications = [];
  announcements = [];
  unReadCounter = 0;

  constructor(
    private sharedService: SharedServiceService,
    private apiService: ApiService,
    private listService: ListService,
    public router: Router,
    private headerFnService: InvokeHeaderFnService,
    private dashboardService: DashboardUtilityService
  ) {
    this.sharedService.activeParentNav.subscribe((val) => {
      let activeTab = localStorage.getItem("active-header");
      if (activeTab != undefined && activeTab != "") {
        val = activeTab;
      }
      this.navSelected = val;
    });

  }

  async ngOnInit() {
    this.init();
    this.getCurrentuser();
    this.showSwitch = localStorage.getItem("subCompany") == 'yes' ? true : false;
    this.fetchCarrier();
    if (this.headerFnService.subsVar === undefined) {
      this.headerFnService.subsVar =
        this.headerFnService.invokeHeaderComponentFunction.subscribe(
          (name: string) => {
            this.upateCurrentUser();
          }
        );
    }
    await this.getAllNotificationAnnouncement();
    setInterval(async () => {
      await this.getAllNotificationAnnouncement();
    }, 1000 * 60 * 5);
  }

  async init() {
    await this.apiService.checkAccess();
    this.isFleetEnabled = environment.isFleetEnabled;
    this.isDispatchEnabled = localStorage.getItem("isDispatchEnabled")
      ? JSON.parse(localStorage.getItem("isDispatchEnabled"))
      : environment.isDispatchEnabled;
    this.isComplianceEnabled = localStorage.getItem("isComplianceEnabled")
      ? JSON.parse(localStorage.getItem("isComplianceEnabled"))
      : environment.isComplianceEnabled;
    this.isManageEnabled = localStorage.getItem("isManageEnabled")
      ? JSON.parse(localStorage.getItem("isManageEnabled"))
      : environment.isManageEnabled;
    this.isSafetyEnabled = localStorage.getItem("isSafetyEnabled")
      ? JSON.parse(localStorage.getItem("isSafetyEnabled"))
      : environment.isSafetyEnabled;
    this.isAccountsEnabled = localStorage.getItem("isAccountsEnabled")
      ? JSON.parse(localStorage.getItem("isAccountsEnabled"))
      : environment.isAccountsEnabled;
      
    environment.isAccountsEnabled;
    
    this.isAddressBook = localStorage.getItem("isAddressBook")
      ? JSON.parse(localStorage.getItem("isAddressBook"))
      : environment.isAddressBook;
      
    this.isReportsEnabled = environment.isReportsEnabled;
  }
  onNavSelected(nav: string) {
    localStorage.setItem("active-header", nav);
    const rootHtml = document.getElementsByTagName("html")[0];
    rootHtml.classList.add("fixed");
    rootHtml.classList.add("sidebar-light");
    rootHtml.classList.add("sidebar-left-collapsed");

    this.navClicked.emit(nav);
    this.sharedService.activeParentNav.next(nav);
  }
  async fetchCarrier() {
    let result: any = await this.dashboardService.getCarriers();
    if (result.Items.length > 0) {
      this.carriers = result.Items[0];
      // this.currentCarrierID = this.carriers.carrierID;
      this.currentCarrierID = localStorage.getItem('xfhCarrierId');
      this.logoSrc = "assets/img/logo.png";
      // if (this.carriers.uploadedLogo !== '') {
      //   this.logoSrc = `${this.Asseturl}/${this.carriers.carrierID}/${this.carriers.uploadedLogo}`;
      // } else {
      //   this.logoSrc = 'assets/img/logo.png';
      // }
    }
  }

  async Logout() {
    try {
      await Auth.signOut();
      this.listService.triggerModal("");
      this.listService.openDocTypeMOdal("");
      localStorage.removeItem("LoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("active-header");
      localStorage.removeItem("carrierID");
      localStorage.removeItem("loggin-carrier");
      localStorage.removeItem("issueVehicleID");
      localStorage.removeItem("carrierID");
      localStorage.removeItem("active-header");
      localStorage.removeItem("currentUserName");
      localStorage.removeItem("nickName");
      localStorage.removeItem("isDispatchEnabled");
      localStorage.removeItem("isComplianceEnabled");
      localStorage.removeItem("isSafetyEnabled");
      localStorage.removeItem("isAccountsEnabled");
      localStorage.removeItem("isManageEnabled");
      localStorage.setItem("signOut", "true"); //trigger flag
      localStorage.removeItem("accessToken"); //Remove token from local
      localStorage.removeItem('xfhCarrierId');
      localStorage.removeItem('currentUserName');
      localStorage.removeItem('subCompany');
      // localStorage.removeItem('jwt');
      this.router.navigate(["/Login"]);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    const selectedCarrier = localStorage.getItem('xfhCarrierId');
    if (selectedCarrier && this.currentUser.userRoles === "orgAdmin") {
      const res = await this.apiService.getData(`carriers/get/detail/${selectedCarrier}`).toPromise()
      this.userRole = 'Super Admin';
      this.currentUser = `${res.Items[0].firstName} ${res.Items[0].lastName}`;
    } else {
      this.currentUser = (await Auth.currentSession()).getIdToken().payload;
      this.userRole = this.currentUser.userType;
      this.currentUser = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    const outputName = this.currentUser.match(/\b(\w)/g);
    this.smallName = outputName.join("");
    localStorage.setItem("currentUserName", this.currentUser);
    localStorage.setItem("nickName", this.smallName);
    this.currentUserName = localStorage.getItem("currentUserName");
    this.nickName = localStorage.getItem("nickName");
  };
  upateCurrentUser() {
    this.currentUserName = localStorage.getItem("currentUserName");
    this.nickName = localStorage.getItem("nickName");
  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);
    this.updateButton = false;
    this.unitData = {
      cName: "",
      dba: "",
      workPhone: "",
      workEmail: "",
      eTypes: [],
      adrs: [
        {
          aType: null,
          cName: "",
          sName: "",
          ctyName: null,
          zip: "",
          add1: "",
          add2: "",
          geoCords: {
            lat: "",
            lng: "",
          },
          userLoc: "",
          manual: false,
          cCode: null,
          sCode: null,
          houseNo: "",
          street: "",
          states: [],
          cities: [],
        },
      ],
      addlCnt: [
        {
          flName: "",
          fName: "",
          lName: "",
          phone: "",
          des: "",
          email: "",
          fax: "",
        },
      ],
      data: [],
    };
  }

  detailMessage: string;
  async showDetail(notification, isNotification = true) {
    this.showNotifications = false;
    this.detailMessage = notification.message;
    this.showNotificationDetail = true;
    if (isNotification && notification.read === 0) {

      await this.apiService.putData(`notification/read/${notification.id}`, {}).toPromise();
    }



  }



  async getAllNotificationAnnouncement() {
    const result = await this.apiService.getData('notification/getAll').toPromise();
    if (result.notifications) {
      this.notifications = result.notifications;
      this.notifications.forEach(element => {
        if (element.read === 0) {
          this.unReadCounter += 1;

        }
        const length = 50;
        element['shortMessage'] = element.message.length > length ?
          element.message.substring(0, length - 3) + "..." :
          element.message;

      });
    }
    if (result.announcements) {
      this.announcements = result.announcements;
      this.announcements.forEach(element => {
        const length = 50;
        element['shortMessage'] = element.message.length > length ?
          element.message.substring(0, length - 3) + "..." :
          element.message;

      });
    }


  }
}
