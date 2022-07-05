import { Component, OnInit, TemplateRef, ViewChild, } from "@angular/core";
import { AccountService, ApiService, ListService } from "../../../../services";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { HereMapService } from "../../../../services/here-map.service";
import { from, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import * as html2pdf from "html2pdf.js";

import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
declare var $: any;
import { environment } from "src/environments/environment";
import Constants from "src/app/pages/fleet/constants";
import { Location } from "@angular/common";
import * as _ from "lodash";
import jsPDF from "jspdf";


@Component({
  selector: "app-trip-detail",
  templateUrl: "./trip-detail.component.html",
  styleUrls: ["./trip-detail.component.css"],
})
export class TripDetailComponent implements OnInit {
  // @ViewChild("tripInfoModal", { static: true })
  // tripInfoModal: TemplateRef<any>;
  // tripInfoRef: any;
  tripInfoModal = false;

  Asseturl = this.apiService.AssetUrl;
  environment = environment.isFeatureEnabled;
  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private hereMap: HereMapService,
    private location: Location,
    private listService: ListService,

  ) {
    this.selectedFileNames = new Map<any, any>();
  }
  noOrdersMsg = Constants.NO_RECORDS_FOUND;
  showSplitModel = false;
  isSplit = false;
  tripData = {
    tripNo: "",
    tripStatus: "",
    documents: [],
    carrierID: "",
    reeferTemperature: "",
    reeferTemperatureUnit: "",
    notifications: {
      changeRoute: false,
      pickUp: false,
      dropOff: false,
      tripToDriver: false,
      tripToDispatcher: false,
    },
    bol: "",
    dateCreated: "",
  };

  driverTerms = '';
  dispatchTerms = '';
  tagLine = '';

  orderType: string;
  tripID = "";
  docType: string;
  allAssetName = "";
  errors: {};
  trips = [];

  newCoords = [];

  speedChartOptions: any;
  speedChartType = "";
  speedChartLegend;
  speedChartData = [];
  speedChartLabels = [];

  temperatureChartOptions: any;
  temperatureChartType = "";
  temperatureChartLegend;
  temperatureChartData = [];
  temperatureChartLabels = [];

  selectedFiles: FileList;
  carrierID = "";
  selectedFileNames: Map<any, any>;
  documentID = [];
  allFetchedOrders = [];
  customersObjects = [];
  orderNumbers = "";
  allDels = [];
  allPOs = [];
  allPUs = [];
  routeName = "-";
  plannedMiles = 0;
  uploadedDocs = [];
  uploadedDocSrc = [];
  vehiclesObject: any = {};
  assetsObject: any = {};
  carriersObject: any = {};
  driversObject: any = {};
  lastDelivery = "";
  stops = 0;
  totalExp = 0;
  tripLog = [];
  expenses = [];
  categories = [];
  splitArr = [];
  showEdit = false;
  showTripInfo = false;
  tripStatus = "";
  recallStatus = false;
  ordersData: any = [];

  companyLogoSrc: string;
  customerData = [];
  isEmail: boolean = false;
  metricSelected: string = 'F';
  metrics = [
    { name: 'F', value: 'F' },
    { name: 'C', value: 'C' },

  ];
  selectPlanID = false;
  isCelsius = false;
  get = _.get;
  subscription: Subscription;
  totalSplits = [];
  newSplits = [];
  selectedSplits = [];
  ngOnInit() {

    this.subscription = this.listService.getDocsModalList.subscribe((res: any) => {
      if (res && res.docType != null && res.docType != '') {
        if (res.module === 'trip') {
          this.docType = res.docType;
          this.uploadBolPods(res);
        }
      }
    })

    this.tripID = this.route.snapshot.params["tripID"];
    this.fetchTripDetail();
    this.mapShow();
    this.fetchTripLog();
    this.fetchExpenses();
    // this.fetchExpenseCategories();

    // this.initSpeedChart();
    // this.initTemperatureChart();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  fetchTripLog() {
    this.apiService
      .getData(`auditLogs/details/${this.tripID}`)
      .subscribe((res: any) => {
        this.tripLog = res.Items;
        if (this.tripLog.length > 0) {
          this.tripLog.map((k) => {
            k.dateAndTime = `${k.createdDate} ${k.createdTime}`;
            if (k.eventParams.userName !== undefined) {
              const newString = k.eventParams.userName.split("_");
              k.userFirstName = newString[0];
              k.userLastName = newString[1];
            }
            if (k.eventParams.number !== undefined) {
              k.entityNumber = k.eventParams.number;
            }
            if (k.eventParams.name !== undefined) {
              if (k.eventParams.name.includes("_")) {
                const newString = k.eventParams.name.split("_");
                k.firstName = newString[0];
                k.lastName = newString[1];
              }
            }
          });

          this.tripLog.sort((a, b) => {
            return (
              new Date(b.dateAndTime).valueOf() -
              new Date(a.dateAndTime).valueOf()
            );
          });
        }
      });
  }
  mapShow() {
    this.hereMap.mapSetAPI();
    this.hereMap.mapInit();
  }

  fetchExpenses() {
    this.accountService.getData(`expense/fetch/${this.tripID}`).subscribe((result: any) => {
      this.expenses = result;

      for (const element of this.expenses) {
        this.totalExp = this.totalExp + element.finalTotal;
      }
    });
  }

  assetNamesList = [];
  tempNamesList = [];
  async fetchTripDetail() {
    this.tripID = this.route.snapshot.params["tripID"];
    let locations = [];
    this.uploadedDocSrc = [];
    this.apiService
      .getData("trips/" + this.tripID)
      .subscribe(async (result: any) => {
        result = result.Items[0];

        if (result.orderId.length > 0) {
          this.customerData = result.customerData;
          this.orderNumbers = result.orderNumbers;
          this.allDels = result.allDels;
          this.allPOs = result.allPOs;
          this.allPUs = result.allPUs;
        }
        if (result.settlmnt) {
          this.tripStatus = "Settled";
          this.recallStatus = false;
        } else {
          if (result.tripStatus === "delivered") {
            this.tripStatus = `${result.tripStatus} (R)`;
            this.recallStatus = true;
          } else {
            this.tripStatus = result.tripStatus;
            this.recallStatus = false;
          }
        }
        if (
          result.tripStatus === "delivered" ||
          result.tripStatus === "cancelled" ||
          result.tripStatus === "tonu"
        ) {
          this.showEdit = false;
        } else {
          this.showEdit = true;
        }
        this.showTripInfo = true;
        if (result.documents == undefined) {
          result.documents = [];
        }
        this.tripData = result;
        this.orderType = result.orderType;
        let tripPlanning = result.tripPlanning;

        if (result.routeID != "" && result.routeID != undefined) {
          this.apiService
            .getData("routes/" + result.routeID)
            .subscribe((result: any) => {
              this.routeName = result.Items[0].routeName;
            });
        }

        for (let i = 0; i < tripPlanning.length; i++) {
          const element = tripPlanning[i];
          let obj = {
            planID: element.planID,
            assetID: element.assetID,
            assetNames: element.assetNames,
            carrierID: element.carrierID,
            carrierName: element.carrierName,
            coDriverName: element.coDriverName,
            coDriverUsername: element.codriverUsername,
            date: element.date,
            driverName: element.driverName,
            driverID: element.driverID,
            driverStatus: element.driverStatus
              ? element.driverStatus.toUpperCase()
              : "",
            coDriverID: element.coDriverID,
            coDriverStatus: element.coDriverStatus
              ? element.coDriverStatus.toUpperCase()
              : "",
            driverUsername: element.driverUsername,
            locationName: element.location,
            mileType: element.mileType,
            miles: element.miles,
            name: element.name,
            trailer: "",
            trailerName: "",
            type: element.type,
            vehicleID: element.vehicleID,
            vehicleName: element.vehicleName,
            // actualDropTime: element.actualDropTime,
            // actualPickupTime: element.actualPickupTime,
            dropTime: element.dropTime,
            time: element.time,
            pickupTime: element.pickupTime,
            commodity: element.commodity ? element.commodity : "",
            orderID: element.orderID ? element.orderID : "",
            orderNumber: element.orderNumber
          };

          if (element.type == "Delivery") {
            this.lastDelivery = element.dropTime;
          }

          if (element.type == "Stop") {
            this.stops += 1;
          }
          this.plannedMiles += parseFloat(element.miles);
          this.newCoords.push(`${element.lat},${element.lng}`);
          this.trips.push(obj);

          // create Asset Object
          for (let i = 0; i < element.assetID.length; i++) {
            const assetObj = {
              assetID: element.assetID[i],
              assetName: element.assetNames[i],

            };
            this.assetNamesList.push(assetObj);

          }

        }

        // filter out duplicates
        this.assetNamesList = _.uniqBy(this.assetNamesList, function (e) {
          return e.assetID;
        });
        this.tempNamesList = _.uniqBy(this.assetNamesList, function (e) {
          return e.assetID;
        });

        let documents = result.tripDocs;
        if (documents.length > 0) {
          documents.forEach((el) => {
            if (el.uploadedDocs.length > 0) {
              el.uploadedDocs.forEach((element) => {
                let name = element.storedName;
                let ext = element.storedName.split(".")[1];
                let obj = {};
                if (ext == "jpg" || ext == "jpeg" || ext == "png") {
                  obj = {
                    imgPath: `${element.urlPath}`,
                    docPath: `${element.urlPath}`,
                    displayName: element.displayName,
                    name: name,
                    ext: ext,
                    type: element.type ? element.type : 'other'
                  };
                } else {
                  obj = {
                    imgPath: "assets/img/icon-pdf.png",
                    docPath: `${element.urlPath}`,
                    displayName: element.displayName,
                    name: name,
                    ext: ext,
                    type: element.type ? element.type : 'other'
                  };
                }
                this.uploadedDocSrc.push(obj);
              });
            }
          });

        }

        if (result.split) {
          result.split.map((x, cind) => {
            this.splitArr[cind] = [];
            x.plan.map((c) => {
              this.trips.map((t) => {
                if (t.planID === c) {
                  this.splitArr[cind].push(t);
                }
              });
            });
          });
        }
        if (result.split && result.split.length > 0) {
          for (let i = 0; i < result.split.length; i++) {
            const element = result.split[i];
            this.totalSplits.push({ splitID: element.splitID, splitName: `Sub Trip - ${this.tripData.tripNo} (${i + 1})` })
          }
          this.newSplits = result.split;

          this.isSplit = true;
        } else {
          this.isSplit = false;
          this.selectedSplits = this.trips;
        }
        if (this.newCoords.length > 0) {
          this.getCoords();
        }

        if (result.termsInfo.logo && result.termsInfo.logo != "") {
          this.companyLogoSrc = `${result.termsInfo.logo}`;
        }
        if (result.termsInfo) {
          this.driverTerms = result.termsInfo.driverTerms ? result.termsInfo.driverTerms : '';
          this.dispatchTerms = result.termsInfo.dispatchTerms ? result.termsInfo.dispatchTerms : '';
          this.tagLine = result.termsInfo.tagLine ? result.termsInfo.tagLine : '';
        }
      });


  }

  /**
   * pass trips coords to show on the map
   * @param data
   */
  async getCoords() {
    this.hereMap.calculateRoute(this.newCoords);
  }

  initSpeedChart() {
    this.speedChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      legend: {
        position: "top",
        labels: {
          boxWidth: 10,
        },
      },
      scales: {
        yAxes: [
          {
            display: true,
            ticks: {
              stepSize: 2,
            },
          },
        ],
      },
    };
    (this.speedChartLabels = [
      "12:00 AM",
      "12:30 AM",
      "1:00 AM",
      "1:30 AM",
      "2:00 AM",
      "2:30 AM",
      "3:00 AM",
      "3:30 AM",
      "4:00 AM",
      "4:30 AM",
      "5:00 AM",
      "5:30 AM",
      "6:00 AM",
      "6:30 AM",
      "7:00 AM",
      "7:30 AM",
      "8:00 AM",
      "8:30 AM",
      "9:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
      "4:30 PM",
      "5:00 PM",
      "5:30 PM",
      "6:00 PM",
      "6:30 PM",
      "7:00 PM",
      "7:30 PM",
      "8:00 PM",
      "8:30 PM",
      "9:00 PM",
      "9:30 PM",
      "10:00 PM",
      "10:30 PM",
      "11:00 PM",
      "11:30 PM",
    ]),
      (this.speedChartType = "line");
    this.speedChartLegend = true;
    this.speedChartData = [
      {
        label: "Speed Chart",
        hidden: false,
        fill: false,
        backgroundColor: "#9c9ea1",
        borderColor: "#9c9ea1",
        borderWidth: 1,
        data: [
          22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22, 22, 35, 47, 50,
          60, 76, 80, 12, 43, 32, 54, 44, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22, 22, 35, 47,
          50, 60, 76, 80, 12, 43, 32, 54, 44, 22, 22, 35, 47, 50, 60, 76, 80,
          12, 43, 32, 54, 44, 22, 22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54,
          44, 22, 22, 35, 47, 50, 60, 76, 80, 12, 43, 32, 54, 44, 22,
        ],
      },
    ];
  }

  initTemperatureChart() {
    this.temperatureChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      legend: {
        position: "top",
        labels: {
          boxWidth: 10,
        },
      },
      scales: {
        yAxes: [
          {
            // ticks: {beginAtZero:true},
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Temperature (F)",
            },
            ticks: {
              min: 0,
              max: 80,
              stepSize: 5,
              suggestedMin: 0,
              suggestedMax: 80,
              // Include a degree sign in the ticks
              callback: function (value, index, values) {
                return value + "°F";
              },
            },
          },
        ],
      },
    };
    (this.temperatureChartLabels = [
      "31 July 12:00",
      "31 July 18:00",
      "1 Aug 00:00",
      "1 Aug 06:00",
      "1 Aug 12:00",
      "1 Aug 18:00",
      "2 Aug 00:00",
      "2 Aug 06:00",
      "2 Aug 12:00",
      "2 Aug 18:00",
    ]),
      (this.temperatureChartType = "line");
    this.temperatureChartLegend = true;
    this.temperatureChartData = [
      {
        label: "Set Temperature",
        fill: false,
        backgroundColor: "#9c9ea1",
        borderColor: "#9c9ea1",
        borderWidth: 1,
        data: [12, 15, 17, 13, 15, 12, 18, 12, 18, 13, 10, 14, 12],
      },
      {
        label: "Actual Temperature",
        fill: false,
        backgroundColor: "#000",
        borderColor: "#000",
        borderWidth: 1,
        data: [10, 14, 12, 11, 14, 11, 15, 12, 16, 14, 11, 13, 14],
      },
    ];
  }

  async uploadBolPods(res: any) {
    for (let i = 0; i < res.documents.length; i++) {
      const element = res.documents[i];
      let name = element.name.split(".");
      let ext = name[name.length - 1];

      if (ext != "jpg" && ext != "jpeg" && ext != "png" && ext != "pdf") {
        $("#bolUpload").val("");
        this.toastr.error("Only image and pdf files are allowed");
        return false;
      }
    }

    for (let i = 0; i < res.documents.length; i++) {
      this.uploadedDocs.push(res.documents[i]);
    }
    // create form data instance
    const formData = new FormData();
    // append photos if any
    for (let i = 0; i < this.uploadedDocs.length; i++) {
      formData.append("uploadedDocs", this.uploadedDocs[i]);
    }

    await this.apiService
      .postData(`trips/upload/docs/${this.tripID}/${this.docType}`, formData, true).toPromise().then((result: any) => {

        if (result && result.length > 0) {
          this.tripData.documents = result;
          this.uploadedDocSrc = [];
          this.uploadedDocs = [];
          for (let k = 0; k < result.length; k++) {
            const element = result[k];
            let name = element.storedName;
            let ext = element.storedName.split('.')[1];
            let obj = {
              imgPath: '',
              docPath: '',
              displayName: '',
              name: '',
              ext: '',
              type: ''
            };
            if (ext == 'jpg' || ext == 'jpeg' || ext == 'png') {
              obj = {
                imgPath: `${element.urlPath}`,
                docPath: `${element.urlPath}`,
                displayName: element.displayName,
                name: name,
                ext: ext,
                type: element.type ? element.type : 'other'
              };
            } else {
              obj = {
                imgPath: 'assets/img/icon-pdf.png',
                docPath: `${element.urlPath}`,
                displayName: element.displayName,
                name: name,
                ext: ext,
                type: element.type ? element.type : 'other'
              };
            }
            this.uploadedDocSrc.push(obj);
          }
          let obj = {
            mode: 'close',
          }
          this.listService.closeModel(obj);
          this.toastr.success('Document uploaded successfully');
        }
      }).catch((err => {
        let obj = {
          mode: 'open',
          message: 'Document type is not valid'
        }
        this.listService.closeModel(obj);
      }))
  }



  openTripInfo() {

    if (this.isSplit) {
      this.showSplitModel = true;
    } else {
      this.tripInfoModal = true;
      // let ngbModalOptions: NgbModalOptions = {
      //   backdrop: "static",
      //   keyboard: false,
      //   windowClass: "trip--info__main",
      // };
      // this.tripInfoRef = this.modalService.open(
      //   this.tripInfoModal,
      //   ngbModalOptions
      // );
    }
  }

  async generate() {
    var data = document.getElementById("print_wrap");
    html2pdf(data, {
      margin: 0.3,
      pagebreak: { mode: 'avoid-all', before: "print_wrap" },
      filename: "trip-information.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        dpi: 300,
        letterRendering: true,
        allowTaint: true,
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    });
    this.tripInfoModal = false;
  }

  async driverEmail() {
    this.isEmail = true;
    let result = await this.apiService.getData(`trips/send/emailDriver?tripID=${this.tripID}&planID=${this.selectPlanID}`).toPromise();
    if (result === null) {
      this.tripInfoModal = false;
      this.toastr.success("Email send successfully");
      this.isEmail = false;
    } else {
      this.isEmail = false;
    }
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  openDocModal() {
    let obj = {
      type: 'trip',
      docLength: this.uploadedDocSrc.length
    }
    this.listService.openDocTypeMOdal(obj)
  }

  alarmCols = [
    { field: 'alAssetName', header: 'Asset Name' },
    { field: 'highTemp', header: 'High' },
    { field: 'lowTemp', header: 'Low' },
    { field: 'alIsActivate', header: 'Is Activated?' },



  ]
  tripAlarms = []
  selectedAssetAlarm;
  async getTripAlarms() {
    this.assetNamesList = [];
    this.assetNamesList.push(...this.tempNamesList)
    this.tripAlarms = await this.apiService.getData(`alarms/${this.tripData.tripNo}`).toPromise();
    this.tripAlarms.forEach(element => {
      // removing asset which has alarm set previously.
      const assetObj = _.find(this.assetNamesList, { assetID: element.assetId });

      if (assetObj) {
        _.remove(this.assetNamesList, { assetID: assetObj.assetID });

        this.selectedAlarmAlert = undefined

      }
      if (element.alTempCelsius == 0) {
        element.highTemp = element.highTemp + ' F';
        element.lowTemp = element.lowTemp + ' F';
      } else {
        element.highTemp = element.highTemp + ' C';
        element.lowTemp = element.lowTemp + ' C'
      }
    });
  }

  alarmInput: IAddAlarmInput;
  showAlerts = false;
  highTemp: number = 10;
  lowTemp: number = -10;
  selectedAlarmAlert = {};
  emails: string
  async addAlerts() {
    this.showAlerts = true;
    await this.getTripAlarms();
  }
  assetAlert = undefined;
  async addAlarmToAsset() {
    this.assetAlert = undefined;
    const assetObj = _.find(this.assetNamesList, { assetName: this.selectedAssetAlarm })
    this.validateMultipleEmails();
    if (!this.isEmailsValid) {
      return;
    }

    this.alarmInput = {
      tripID: this.tripID,
      tripNo: this.tripData.tripNo,
      assetID: assetObj.assetID,
      assetName: assetObj.assetName,
      highTemp: this.highTemp.toString(),
      lowTemp: this.lowTemp.toString(),
      emails: this.emails.split(','),
      isCelsius: this.isCelsius === true ? 1 : 0, // Is in Celsius or Fahrenheit 
      active: this.tripStatus == 'dispatched' || this.tripStatus == 'started' || this.tripStatus == 'enroute' ? 1 : 0


    }
    await this.apiService.postData('alarms', this.alarmInput).subscribe(async (data: any) => {
      await this.getTripAlarms();

    }, error => {
      if (error && error.error && error.error.errorMessage.includes('Temperature sensor')) {
        this.assetAlert = error.error.errorMessage;
      }
    });

  }

  async deleteAlarm(rowData) {

    const decision = confirm('Do you want to Delete the Alarm?');
    if (decision) {
      await this.apiService.deleteData(`alarms/${rowData.alAlarmId}`).toPromise(); this.showAlerts = false;

    }
  }

  isEmailsValid = true;
  validateMultipleEmails() {
    // Get value on emails input as a string


    // Split string by comma into an array
    let emailsValidate = this.emails.split(",");


    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const invalidEmails = [];

    for (let i = 0; i < emailsValidate.length; i++) {
      // Trim whitespaces from email address
      emailsValidate[i] = emailsValidate[i].trim();

      // Check email against our regex to determine if email is valid
      if (emailsValidate[i] == "" || !regex.test(emailsValidate[i])) {
        invalidEmails.push(emailsValidate[i]);
      }
    }
    if (invalidEmails.length > 0) {
      this.isEmailsValid = false;
    } else {
      this.isEmailsValid = true;
    }
  }

  changeMetric(e) {

    if (e.value === 'F') {
      this.isCelsius = false;
    } else {
      this.isCelsius = true;
    }
  }

  changeSplitTrips() {
    if (this.selectPlanID) {
      let planResult = this.newSplits.filter(elem => { return elem.splitID === this.selectPlanID })
      if (planResult && planResult.length > 0 && planResult[0].plan) {
        let newData = []
        let planIds = planResult[0].plan;
        planIds.map((c, cind) => {
          this.trips.map((t) => {
            if (t.planID === c) {
              newData.push(t);
            }
          });
        });
        this.selectedSplits = newData;
      }
    }

  }

  showTripInfoModel() {
    if (this.selectPlanID) {
      this.isEmail = false;
      this.tripInfoModal = true;
    }
  }

  // delete uploaded images and documents
  async delete(name: string, index) {

    if (confirm("Are you sure you want to delete?") === true) {
      await this.apiService
        .deleteData(`trips/uploadDelete/${this.tripID}/${name}`)
        .toPromise();
      this.uploadedDocSrc.splice(index, 1);
      this.toastr.success("Document deleted successfully");
    }
  }


}

interface IAddAlarmInput {
  tripNo: string,
  tripID: string,
  assetID: string,
  assetName: string,
  highTemp: string,
  lowTemp: string,
  emails: string[],
  isCelsius: number,
  active: number
}