import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { AccountService } from "src/app/services/account.service";
import { ApiService } from "src/app/services/api.service";
import { ListService } from "src/app/services/list.service";
import * as html2pdf from "html2pdf.js";
import * as moment from "moment";
import Constants from "src/app/pages/fleet/constants";
import { Auth } from "aws-amplify";

@Component({
  selector: "app-detail-pdf",
  templateUrl: "./detail-pdf.component.html",
  styleUrls: ["./detail-pdf.component.css"],
})
export class DetailPdfComponent implements OnInit {
  fetchingdata: string = Constants.FETCHING_DATA;
  @ViewChild("settlmentDetail", { static: true })
  modalContent: TemplateRef<any>;
  subscription: Subscription;
  totalMiles: any;
  settlementData = {
    type: null,
    entityId: null,
    setNo: "",
    txnDate: "",
    fromDate: null,
    toDate: null,
    prStart: null,
    prEnd: null,
    tripIds: [],
    trpData: [],
    miles: {
      tripsTotal: 0,
      driverTotal: 0,
      tripsLoaded: 0,
      driverLoaded: 0,
      tripsEmpty: 0,
      driverEmpty: 0,
      tripsTeam: 0,
      driverHours: 0,
      teamHours: 0,
      totalHours: 0,
      drivers: [],
      driverLoadedTeam: 0,
      driverEmptyTeam: 0,
    },
    addition: [],
    deduction: [],
    additionTotal: 0,
    deductionTotal: 0,
    taxObj: {
      gstPrcnt: 0,
      pstPrcnt: 0,
      hstPrcnt: 0,
      gstAmount: 0,
      pstAmount: 0,
      hstAmount: 0,
      carrLocalTax: 0,
      carrLocalAmount: 0,
      carrFedTax: 0,
      carrFedAmount: 0,
    },
    paymentTotal: 0,
    taxes: 0,
    subTotal: 0,
    finalTotal: 0,
    fuelAdd: 0,
    fuelDed: 0,
    status: "unpaid",
    paymentLinked: false,
    pendingPayment: 0,
    currency: "CAD",
    paymentInfo: {
      lMiles: 0,
      lMileTeam: 0,
      eMileTeam: 0,
      rate: 0,
      eMiles: 0,
      pRate: 0,
      dRate: 0,
      pType: "",
    },
    fuelIds: [],
    fuelData: [],
  };
  logoSrc = "assets/img/logo.png";
  otherLogoSrc = "assets/img/stl-top-logo.png";
  entityName = "";
  operatorDriversList = [];
  settledTrips = [];
  selectedTrips = [];
  fuelEnteries = [];
  currentUser: any = "";
  companyName: any = "";
  companyLogo = "";

  constructor(
    private listService: ListService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    // settlmentDetailSection
    this.subscription = this.listService.settlementDetails.subscribe(
      async (res: any) => {
        if (res.showModal && res.length != 0) {
          await this.getCurrentuser();
          this.settlementData = res.settlementData;
          this.entityName = res.entityName;
          this.fuelEnteries = res.fuelEnteries;

          for (let i = 0; i < this.settlementData.miles.drivers.length; i++) {
            const element = this.settlementData.miles.drivers[i];
            this.operatorDriversList.push(element.driverID);
          }

          if (this.settlementData.tripIds.length > 0) {
            let stldTrips = encodeURIComponent(
              JSON.stringify(this.settlementData.tripIds)
            );
            this.fetchSettledTrips(stldTrips);
          }

          let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: false,
            windowClass: "settlmentDetailSection-prog__main",
          };
          res.showModal = false;
          this.modalService
            .open(this.modalContent, ngbModalOptions)
            .result.then(
              (result) => { },
              (reason) => { }
            );
        }
      }
    );
  }

  async generatePDF() {
    var data = document.getElementById("settlmentDetailSection");
    html2pdf(data, {
      margin: [0.5, 0, 0.5, 0],
      pagebreak: { mode: "avoid-all", before: "settlmentDetailSection" },
      filename: `STL-${this.settlementData.setNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        logging: true,
        dpi: 192,
        letterRendering: true,
        allowTaint: true,
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    });
  }

  async fetchSettledTrips(tripIds) {
    let result: any = await this.apiService
      .getData(`trips/entity/settled/data/${tripIds}`)
      .toPromise();
    this.settledTrips = result;
    let miles = 0;
    for (let i = 0; i < this.settledTrips.length; i++) {
      const element = this.settledTrips[i];

      if (this.settlementData.deduction.length > 0) {
        this.settlementData.deduction.map((dedStl) => {
          if (dedStl.tripID === element.tripID) {
            dedStl.tripName = element.tripNo;
          }
        });
      }

      if (this.settlementData.addition.length > 0) {
        this.settlementData.addition.map((dedStl) => {
          if (dedStl.tripID === element.tripID) {
            dedStl.tripName = element.tripNo;
          }
        });
      }

      element.pickupLocation = "";
      element.dropLocation = "";
      element.carrID = [];
      let pickCount = 1;
      let dropCount = 1;
      element.selected = false;
      element.subSelected = false;
      element.splitArr = [];
      element.indeterminate = false;
      element.entityMiles = 0;
      element.entityDriver = [];
      element.entityVehicle = [];
      element.entityAsset = [];
      element.entityCarrier = [];
      for (let j = 0; j < element.tripPlanning.length; j++) {
        const plan = element.tripPlanning[j];

        if (
          this.settlementData.type === "driver" ||
          this.settlementData.type === "carrier"
        ) {
          if (
            this.settlementData.entityId === plan.driverID ||
            this.settlementData.entityId === plan.coDriverID ||
            this.settlementData.entityId === plan.carrierID
          ) {
            element.pickupLocation += `${pickCount}) <strong>${plan.type
              }</strong>: ${plan.location} <br>
            <u>Date</u>: ${moment(plan.date).format("YYYY/MM/DD")}, <u>${plan.type === "Pickup" ? "Pickup" : "Drop"
              } Time</u>: ${plan.type === "Pickup" ? plan.pickupTime : plan.dropTime
              } <br>`;
            pickCount++;
            element.entityMiles += Number(plan.miles);

            if (
              this.settlementData.entityId === plan.driverID ||
              this.settlementData.entityId === plan.coDriverID
            ) {
              if (!element.entityDriver.includes(plan.driverID)) {
                element.entityDriver.push(plan.driverID);
              }

              if (!element.entityDriver.includes(plan.coDriverID)) {
                element.entityDriver.push(plan.coDriverID);
              }
            }

            if (!element.entityVehicle.includes(plan.vehicleID)) {
              element.entityVehicle.push(plan.vehicleID);
            }

            if (!element.entityCarrier.includes(plan.carrierID)) {
              element.entityCarrier.push(plan.carrierID);
            }

            for (let f = 0; f < plan.assetID.length; f++) {
              const elemAsset = plan.assetID[f];
              if (!element.entityAsset.includes(elemAsset)) {
                element.entityAsset.push(elemAsset);
              }
            }
          }
        } else if (this.settlementData.type === "owner_operator") {
          if (
            this.operatorDriversList.includes(plan.driverID) ||
            this.operatorDriversList.includes(plan.coDriverID)
          ) {
            element.pickupLocation += `${pickCount}) <strong>${plan.type
              }</strong>: ${plan.location} <br>
              <u>Date</u>: ${moment(plan.date).format("YYYY/MM/DD")}, <u>${plan.type === "Pickup" ? "Pickup" : "Drop"
              } Time</u>: ${plan.type === "Pickup" ? plan.pickupTime : plan.dropTime
              } <br>`;
            pickCount++;
            element.entityMiles += Number(plan.miles);

            if (!element.entityDriver.includes(plan.driverID)) {
              element.entityDriver.push(plan.driverID);
            }

            if (!element.entityDriver.includes(plan.coDriverID)) {
              element.entityDriver.push(plan.coDriverID);
            }

            if (!element.entityVehicle.includes(plan.vehicleID)) {
              element.entityVehicle.push(plan.vehicleID);
            }

            if (!element.entityCarrier.includes(plan.carrierID)) {
              element.entityCarrier.push(plan.carrierID);
            }

            for (let f = 0; f < plan.assetID.length; f++) {
              const elemAsset = plan.assetID[f];
              if (!element.entityAsset.includes(elemAsset)) {
                element.entityAsset.push(elemAsset);
              }
            }
          }
        }

        if (plan.carrierID !== "") {
          if (!element.carrID.includes(plan.carrierID)) {
            element.carrID.push(plan.carrierID);
          }
        }
      }

      if (element.split && element.split.length > 0) {
        element.split.map((main) => {
          let arrr = {
            selected: false,
            splitID: main.splitID,
            splitName: main.splitName,
            trips: [],
          };
          if (main.plan) {
            main.plan.map((c) => {
              if (
                this.settlementData.type === "driver" ||
                this.settlementData.type === "carrier"
              ) {
                // if (main.stlStatus.includes(entStat)) {
                if (this.settlementData.type === "driver") {
                  element.tripPlanning.map((trp) => {
                    if (c === trp.planID) {
                      if (
                        this.settlementData.entityId === trp.driverID ||
                        this.settlementData.entityId === trp.coDriverID
                      ) {
                        trp.planLoc = this.setTripLoc(trp);
                        arrr.trips.push(trp);
                      }
                    }
                  });
                } else if (this.settlementData.type === "carrier") {
                  element.tripPlanning.map((trp) => {
                    if (c === trp.planID) {
                      if (this.settlementData.entityId === trp.carrierID) {
                        trp.planLoc = this.setTripLoc(trp);
                        arrr.trips.push(trp);
                      }
                    }
                  });
                }
                // }
              } else if (this.settlementData.type === "owner_operator") {
                let exstPlanIDs = [];
                for (
                  let index = 0;
                  index < this.operatorDriversList.length;
                  index++
                ) {
                  const drvr = this.operatorDriversList[index];
                  // entStat = `${drvr}:false`;
                  // if (main.stlStatus.includes(entStat)) {
                  element.tripPlanning.map((trp) => {
                    if (c === trp.planID) {
                      if (!exstPlanIDs.includes(trp.planID)) {
                        exstPlanIDs.push(trp.planID);
                        if (
                          this.operatorDriversList.includes(trp.driverID) ||
                          this.operatorDriversList.includes(trp.coDriverID)
                        ) {
                          trp.planLoc = this.setTripLoc(trp);
                          arrr.trips.push(trp);
                        }
                      }
                    }
                  });
                  // }
                }
              }
            });
          }

          if (arrr.trips.length > 0) {
            element.splitArr.push(arrr);
          }
        });
      }

      miles += element.entityMiles;
    }
    this.totalMiles = miles;
  }

  setTripLoc(trp) {
    let planLoc = "";
    if (trp.locMan) {
      planLoc = `${trp.locData.addr}, ${trp.locData.ctName}, ${trp.locData.sName}, ${trp.locData.cName} ${trp.locData.zip}`;
    } else {
      planLoc = trp.location;
    }

    return planLoc;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    const carrierID = this.currentUser.carrierID;
    let result: any = await this.apiService
      .getData(`carriers/detail/${carrierID}`)
      .toPromise();
    this.companyName = result.companyName;
    this.companyLogo = result.logo;
  };
}
