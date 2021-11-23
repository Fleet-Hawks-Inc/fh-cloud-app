import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AccountService, ApiService } from "../../../../services";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { HereMapService } from "../../../../services/here-map.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import * as html2pdf from "html2pdf.js";

import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
declare var $: any;
import { environment } from "src/environments/environment";
import Constants from "src/app/pages/fleet/constants";
@Component({
  selector: "app-trip-detail",
  templateUrl: "./trip-detail.component.html",
  styleUrls: ["./trip-detail.component.css"],
})
export class TripDetailComponent implements OnInit {
  @ViewChild("tripInfoModal", { static: true })
  tripInfoModal: TemplateRef<any>;
  tripInfoRef: any;

  Asseturl = this.apiService.AssetUrl;
  environment = environment.isFeatureEnabled;
  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private hereMap: HereMapService
  ) {
    this.selectedFileNames = new Map<any, any>();
  }
  noOrdersMsg = Constants.NO_RECORDS_FOUND;
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
  orderType: string;
  tripID = "";
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

  customerData = [];

  ngOnInit() {
    this.fetchAllVehiclesIDs();
    this.fetchAllAssetIDs();
    this.fetchAllCarrierIDs();
    this.fetchAllDriverIDs();
    this.fetchCustomersByIDs();
    this.tripID = this.route.snapshot.params["tripID"];
    this.fetchTripDetail();
    this.mapShow();
    this.fetchTripLog();
    this.fetchExpenses();
    this.fetchExpenseCategories();
    this.fetchTripDocuments();

    // this.initSpeedChart();
    // this.initTemperatureChart();
  }
  async fetchDriverStatus(driverID: any) {
    let result = await this.apiService
      .getData(`drivers/status/${this.tripID}/${driverID}`)
      .toPromise();

    return result.status.toUpperCase();
  }

  fetchTripDocuments() {
    this.apiService
      .getData(`documents/trip/${this.tripID}`)
      .subscribe((res: any) => {
        let documents = res.Items;
        if (documents.length > 0) {
          documents.forEach((el) => {
            if (
              el.docType == "Bill of Lading" ||
              el.docType == "Proof of Delivery"
            ) {
              if (el.uploadedDocs.length > 0) {
                el.uploadedDocs.forEach((element) => {
                  let name = element.storedName;
                  let ext = element.storedName.split(".")[1];
                  let obj = {};
                  if (ext == "jpg" || ext == "jpeg" || ext == "png") {
                    obj = {
                      imgPath: `${this.Asseturl}/${el.carrierID}/${element.storedName}`,
                      docPath: `${this.Asseturl}/${el.carrierID}/${element.storedName}`,
                      displayName: element.displayName,
                      name: name,
                      ext: ext,
                    };
                  } else {
                    obj = {
                      imgPath: "assets/img/icon-pdf.png",
                      docPath: `${this.Asseturl}/${el.carrierID}/${element.storedName}`,
                      displayName: element.displayName,
                      name: name,
                      ext: ext,
                    };
                  }
                  this.uploadedDocSrc.push(obj);
                });
              }
            }
          });
        }
      });
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

  fetchCustomersByIDs() {
    this.apiService
      .getData("contacts/get/list/customer")
      .subscribe((result: any) => {
        this.customersObjects = result;
      });
  }
  fetchExpenses() {
    this.accountService.getData(`expense`).subscribe((result: any) => {
      this.expenses = result.filter((e: any) => {
        return e.tripID === this.tripID;
      });
      for (const element of this.expenses) {
        this.totalExp = this.totalExp + element.amount;
      }
    });
  }
  fetchExpenseCategories() {
    this.accountService
      .getData(`expense/categories/list`)
      .subscribe((result: any) => {
        this.categories = result;
      });
  }
  async fetchTripDetail() {
    this.tripID = this.route.snapshot.params["tripID"];
    let locations = [];
    this.apiService
      .getData("trips/" + this.tripID)
      .subscribe(async (result: any) => {
        result = result.Items[0];

        if (result.orderId.length > 0) {
          await this.fetchOrderDetails(result.orderId);
          await this.fetchCustomerDetails(result.orderId)
        }
        if (result.settlmnt) {
          this.tripStatus = "Settled";
        } else {
          this.tripStatus = result.tripStatus;
        }
        if (result.recall) {
          this.recallStatus = true;
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

        if (result.documents.length > 0) {
          for (let k = 0; k < result.documents.length; k++) {
            const element = result.documents[k];
            let name = element.storedName;
            let ext = element.storedName.split(".")[1];
            let obj = {
              imgPath: "",
              docPath: "",
              displayName: "",
              name: "",
              ext: "",
            };
            if (ext == "jpg" || ext == "jpeg" || ext == "png") {
              obj = {
                imgPath: `${this.Asseturl}/${result.carrierID}/${element.storedName}`,
                docPath: `${this.Asseturl}/${result.carrierID}/${element.storedName}`,
                displayName: element.displayName,
                name: name,
                ext: ext,
              };
            } else {
              obj = {
                imgPath: "assets/img/icon-pdf.png",
                docPath: `${this.Asseturl}/${result.carrierID}/${element.storedName}`,
                displayName: element.displayName,
                name: name,
                ext: ext,
              };
            }
            this.uploadedDocSrc.push(obj);
          }
        }

        for (let i = 0; i < tripPlanning.length; i++) {
          const element = tripPlanning[i];
          let obj = {
            planID: element.planID,
            assetID: element.assetID,
            carrierID: element.carrierID,
            carrierName: "",
            coDriverName: "",
            coDriverUsername: element.codriverUsername,
            date: element.date,
            driverName: "",
            driverID: element.driverID,
            driverStatus: element.driverID
              ? await this.fetchDriverStatus(element.driverID)
              : "",
            coDriverID: element.coDriverID,
            coDriverStatus: element.coDriverID
              ? await this.fetchDriverStatus(element.coDriverID)
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
            vehicleName: "",
            // actualDropTime: element.actualDropTime,
            // actualPickupTime: element.actualPickupTime,
            dropTime: element.dropTime,
            time: element.time,
            pickupTime: element.pickupTime,
            commodity: element.commodity ? element.commodity : "",
            orderID: element.orderID ? element.orderID : "",
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

        if (this.newCoords.length > 0) {
          this.getCoords();
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

  async fetchOrderDetails(orderIds) {
    orderIds = JSON.stringify(orderIds);
    let result: any = await this.apiService
      .getData("orders/fetch/selectedOrders?orderIds=" + orderIds)
      .toPromise();
    for (let i = 0; i < result.length; i++) {
      const element = result[i];

      this.orderNumbers += element.orderNumber;
      if (i < result.length - 1) {
        this.orderNumbers = this.orderNumbers + ", ";
      }
    }

    this.ordersData = result.reduce((a: any, b: any) => {
      return (a[b["orderID"]] = b["orderNumber"]), a;
    }, {});
  }

  async fetchCustomerDetails(orderIds) {
    orderIds = JSON.stringify(orderIds);
    let result: any = await this.apiService
      .getData("orders/fetch/customerInfo/orders?orderIds=" + orderIds)
      .toPromise();
    this.customerData = result;

  }

  /*
   * Selecting files before uploading
   */
  selectDocuments(event: any) {
    this.uploadedDocs = [];
    let files = [...event.target.files];
    let totalCount = this.tripData.documents.length + files.length;

    if (totalCount > 4) {
      $("#bolUpload").val("");
      this.toastr.error("Only 4 documents can be uploaded");
      return false;
    } else {
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        let name = element.name.split(".");
        let ext = name[name.length - 1];

        if (ext != "jpg" && ext != "jpeg" && ext != "png" && ext != "pdf") {
          $("#bolUpload").val("");
          this.toastr.error("Only image and pdf files are allowed");
          return false;
        }
      }

      // create form data instance
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        this.uploadedDocs.push(element);
      }

      //append docs if any
      for (let j = 0; j < this.uploadedDocs.length; j++) {
        let file = this.uploadedDocs[j];
        formData.append(`uploadedDocs-${j}`, file);
      }

      formData.append("data", JSON.stringify(this.tripData.documents));

      this.apiService
        .postData("trips/update/bol/" + this.tripID, formData, true)
        .subscribe({
          complete: () => { },
          error: (err: any) => {
            from(err.error)
              .pipe(
                map((val: any) => {
                  val.message = val.message.replace(/".*"/, "This Field");
                  this.errors[val.context.label] = val.message;
                  this.spinner.hide();
                })
              )
              .subscribe({
                complete: () => {
                  this.spinner.hide();
                },
                error: () => { },
                next: () => { },
              });
          },
          next: (res: any) => {
            this.tripData.documents = res;

            this.uploadedDocSrc = [];
            if (res.length > 0) {
              for (let k = 0; k < res.length; k++) {
                const element = res[k];
                // this.uploadedDocSrc.push(`${this.Asseturl}/${this.tripData.carrierID}/${element}`);

                let name = element.storedName;
                let ext = element.storedName.split(".")[1];
                let obj = {
                  imgPath: "",
                  docPath: "",
                  displayName: "",
                  name: "",
                  ext: "",
                };
                if (ext == "jpg" || ext == "jpeg" || ext == "png") {
                  obj = {
                    imgPath: `${this.Asseturl}/${this.tripData.carrierID}/${element.storedName}`,
                    docPath: `${this.Asseturl}/${this.tripData.carrierID}/${element.storedName}`,
                    displayName: element.displayName,
                    name: name,
                    ext: ext,
                  };
                } else {
                  obj = {
                    imgPath: "assets/img/icon-pdf.png",
                    docPath: `${this.Asseturl}/${this.tripData.carrierID}/${element.storedName}`,
                    displayName: element.displayName,
                    name: name,
                    ext: ext,
                  };
                }
                this.uploadedDocSrc.push(obj);
              }
            }
            this.toastr.success("BOL/POD uploaded successfully");
          },
        });
    }
  }

  fetchAllVehiclesIDs() {
    this.apiService.getData("vehicles/get/list").subscribe((result: any) => {
      this.vehiclesObject = result;
    });
  }

  fetchAllAssetIDs() {
    this.apiService.getData("assets/get/list").subscribe((result: any) => {
      this.assetsObject = result;
    });
  }

  fetchAllCarrierIDs() {
    this.apiService
      .getData("contacts/get/list/carrier")
      .subscribe((result: any) => {
        this.carriersObject = result;
      });
  }

  fetchAllDriverIDs() {
    this.apiService.getData("drivers/get/list").subscribe((result: any) => {
      this.driversObject = result;
    });
  }

  openTripInfo() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: false,
      windowClass: "trip--info__main",
    };
    this.tripInfoRef = this.modalService.open(this.tripInfoModal, ngbModalOptions);
  }

  async generate() {
    var data = document.getElementById("print_wrap");
    html2pdf(data, {
      margin: 0.15,
      filename: "trip-information.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        dpi: 300,
        letterRendering: true,
        allowTaint: true,
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });

    this.tripInfoRef.close();
  }

  driverEmail() {
    this.apiService
      .getData(`trips/send/emailDriver/${this.tripID}`)
      .subscribe((res: any) => {

      });
  }
}
