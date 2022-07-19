import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbTimeStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { Auth } from "aws-amplify";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, from, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { CountryStateCityService } from "src/app/services/country-state-city.service";
import { RouteManagementServiceService } from "src/app/services/route-management-service.service";
import { v4 as uuidv4 } from "uuid";
import { environment } from "../../../../../environments/environment.prod";
import {
  ApiService,
  DashboardUtilityService,
  HereMapService,
  ListService,
} from "../../../../services";
import { PdfAutomationService } from "../../pdf-automation/pdf-automation.service";
import { isPointInPolygon } from "geolib";

declare var $: any;
declare var H: any;
@Component({
  selector: "app-add-orders",
  templateUrl: "./add-orders.component.html",
  styleUrls: ["./add-orders.component.css"],
})
export class AddOrdersComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  public isTrueDataSource = new BehaviorSubject<boolean>(false);
  isTrueList = this.isTrueDataSource.asObservable();
  public getOrderID;
  aOrder1: NgForm;
  pageTitle = "Add Order";
  private readonly search: any;
  public searchTerm = new Subject<string>();
  public searchResults: any = "";
  public readonly apiKey = environment.mapConfig.apiKey;
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 30 };
  seconds = false;
  meridian = true;
  spinners = false;
  apiSelect = "";
  freightFee: any = 0;
  fuelSurcharge: any = 0;
  accessorialFee: any = 0;
  accessorialDeduction: any = 0;
  totalMiles: any = 0;
  subTotal: any = 0;
  totalAmount: any = 0;
  discount: any = 0;
  tax: any = 0;
  shipperList = [];
  receiverList = [];
  stateTaxes = [];
  stateTaxID = "";
  shipperLocation;
  receiverLocation;
  mergedArray = [];
  getAllCords = [];
  googleCords = [];
  assetTypes = [];
  form;
  visibleIndex = 0;
  customerSelected: any = [];
  orderMode: string = "FTL";
  radioSelected: any;
  countries;
  states;
  cities;
  cusPOs = [];
  getOrderNumber: string;
  orderData = {
    cusPOs: [],
    stateTaxID: "",
    invoiceGenerate: false,
    customerID: null,
    cusConfirmation: "",
    cusAddressID: "",
    orderNumber: "",
    createdDate: "",
    createdTime: "",
    reference: "",
    phone: "",
    email: "",
    zeroRated: true,
    TotalAgreedAmount: "",
    ShipperDetails: "",
    ConsigneeDetails: "",
    Customer: "",
    Reference: "",
    csa: "",
    ctpat: "",
    additionalcontactname: "",
    pickuplocation: "",
    pickupinstruction: "",
    contactpersonatpickup: "",
    shipperphone: "",
    shipperreference: "",
    shippernotes: "",
    dropofflocation: "",
    deliveryinstruction: "",
    contactpersonatdelivery: "",
    receiverphone: "",
    receiverreference: "",
    receivernotes: "",

    shipperInfo: [],
    receiverInfo: [],
    freightDetails: {},
    additionalContact: null,
    invoiceEmail: false,
    additionalDetails: {
      trailerType: "",
      sealNo: "",
      sealType: "",
      uploadedDocs: [],
      refeerTemp: {
        maxTemprature: "",
        maxTempratureUnit: "",
        minTemprature: "",
        minTempratureUnit: "",
      },
    },

    orderStatus: "created",
    orderMode: "FTL",
    tripType: "Regular",
    shippersReceiversInfo: [],
    charges: {
      freightFee: {
        type: null,
        amount: 0,
        currency: "CAD",
      },
      fuelSurcharge: {
        type: null,
        amount: 0,
        currency: null,
      },
      accessorialFeeInfo: {
        accessorialFee: [],
      },
      accessorialDeductionInfo: {
        accessorialDeduction: [],
      },
    },
    taxesInfo: [],
    discount: {
      amount: "",
      unit: "",
    },
    advance: 0,
    finalAmount: 0,
    milesInfo: {
      totalMiles: null,
      calculateBy: "manual",
    },
    remarks: "",
    loc: "",
    tripData: {
      tripID: "",
      tripNo: "",
    },
  };
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  notOfficeAddress: boolean = false;

  Error: string = "";
  Success: string = "";
  errors = {};

  isConfirmExist = false;
  isConfirmData: any = {
    confirmNo: "",
    orderNo: "",
  };

  origin: any;
  destination: any;
  allLoadTypes = [
    { name: "hazMat" },
    { name: "oversize load" },
    { name: "reefer" },
    { name: "tanker" },
  ];
  loadTypeData = [];

  activeId: string = "";
  newTaxes = [
    {
      type: "",
      amount: 0,
      taxAmount: 0,
    },
  ];

  customerPOs = [];

  photoSizeError = "";

  showShipperUpdate: boolean = false;
  showReceiverUpdate: boolean = false;
  ltlSurcharge = null;
  ftlSurcharge = null;
  shippersReceivers = [
    {
      shippers: {
        shipperID: null,
        pickupPoint: [
          {
            unit: false,
            unitNumber: "",
            address: {
              countryName: "",
              stateName: "",
              cityName: null,
              zipCode: "",
              address: "",

              pickupLocation: null,
              manual: false,
              countryCode: null,
              stateCode: null,
              states: [],
              cities: [],
              geoCords: {},
            },
            pickupDate: "",
            pickupTime: "",
            pickupInstruction: "",
            contactPerson: "",
            phone: "",
            customerPO: [],
            newCustomerPO: [],
            commodity: [
              {
                name: "",
                quantity: "",
                quantityUnit: null,
                weight: "",
                weightUnit: null,
                pu: "",
              },
            ],
          },
        ],
        driverLoad: false,
        liveLoad: true,
        save: true,
        update: false,
        isShow: true,
      },
      receivers: {
        receiverID: null,
        dropPoint: [
          {
            unit: false,
            unitNumber: "",
            address: {
              zipCode: "",
              address: "",
              dropOffLocation: null,
              manual: false,
              countryName: "",
              countryCode: null,
              stateName: "",
              stateCode: null,
              cityName: null,
              states: [],
              cities: [],
              geoCords: {},
            },
            dropOffDate: "",
            dropOffTime: "",
            dropOffInstruction: "",
            contactPerson: "",
            phone: "",
            zone: {
              zoneID: null,
              zName: null,
              pRates: null,
              aspRates: null,
            },
            commodity: [
              {
                name: "",
                quantity: "",
                quantityUnit: null,
                weight: "",
                weightUnit: null,
                del: "",
              },
            ],
          },
        ],

        driverUnload: false,
        liveUnLoad: true,
        save: true,
        update: false,
        isShow: true,
      },
    },
  ];

  accessFeesInfo = {
    accessFees: [
      {
        type: null,
        amount: 0,
        currency: null,
      },
    ],
  };

  deletedFiles = [];

  accessorialDeductionInfo = {
    accessDeductions: [
      {
        type: null,
        amount: 0,
        currency: null,
      },
    ],
  };

  shipAddresses = [];
  receiverAddresses = [];

  customers: any = [];
  shippers: any = [];
  receivers: any = [];
  finalShippersReceivers = [
    {
      shippers: [],
      receivers: [],
    },
  ];

  shippersObjects: any = {};
  receiversObjects: any = {};
  singleDatePickerOptions;

  stateShipperIndex: any;
  stateReceiverIndex: any;
  uploadedDocs = [];
  existingUploadedDocs = [];
  packagingUnitsList: any = [];

  isSubmit = false;
  isShipperSubmit = false;
  isReceiverSubmit = false;
  orderAttachments = [];
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl("");
  submitDisabled = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  ifStatus = "";

  cusAdditionalContact: any = [];
  isInvoiceGenerated: boolean;

  cloneID: any;
  recalledState = false;

  orderPrefix: string = "";
  zoneList = [];
  selectedZone = null;

  constructor(
    private apiService: ApiService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private HereMap: HereMapService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private pdfService: PdfAutomationService,
    private httpClient: HttpClient,
    private listService: ListService,
    private domSanitizer: DomSanitizer,
    private location: Location,
    private countryStateCity: CountryStateCityService,
    private routeManagement: RouteManagementServiceService,

    private dashboardUtilityService: DashboardUtilityService
  ) {
    const current = new Date();

    // config.minDate = {
    //   year: current.getFullYear(),
    //   month: current.getMonth() + 1,
    //   day: current.getDate(),
    // };
    // config.outsideDays = "hidden";

    // this.pdfService.dataSubscribe$
    //   .pipe(
    //     tap((v) => {

    //       if (v.toString() !== "" && v !== "undefined" && v !== undefined) {
    //         const d = JSON.parse(v);

    //         this.orderData.orderNumber = d.OrderNumber;
    //         this.orderData.customerPO = d.CustomerPO;
    //         this.orderData.reference = d.reference;
    //         this.orderData.csa = d.csa;
    //         this.orderData.ctpat = d.ctpat;
    //         this.orderData.additionalcontactname = d.additionalcontactname;
    //         this.orderData.email = d.email;
    //         this.orderData.phone = d.phone;

    //         this.shippersReceivers[0].shippers.shipperID = d.shippersshipperID;
    //         this.shippersReceivers[0].shippers.pickupLocation =
    //           d.shipperspickupLocation;
    //         this.shippersReceivers[0].shippers.pickupDate =
    //           d.shipperspickupDate;
    //         this.shippersReceivers[0].shippers.pickupTime =
    //           d.shipperspickupTime;
    //         this.shippersReceivers[0].shippers.pickupInstruction =
    //           d.shipperspickupInstruction;
    //         this.shippersReceivers[0].shippers.contactPerson =
    //           d.shipperscontactPerson;
    //         this.shippersReceivers[0].shippers.phone = d.shippersshipperID;

    //         this.shippersReceivers[0].shippers.commodity[0].name =
    //           d.shipperscommodityname;
    //         this.shippersReceivers[0].shippers.commodity[0].quantity =
    //           d.shipperscommodityquantity;
    //         this.shippersReceivers[0].shippers.commodity[0].quantityUnit =
    //           d.shipperscommodityquantityUnit;
    //         this.shippersReceivers[0].shippers.commodity[0].weight =
    //           d.shippersweight;
    //         this.shippersReceivers[0].shippers.commodity[0].weightUnit =
    //           d.shippersweightUnit;

    //         this.shippersReceivers[0].receivers.receiverID =
    //           d.receiversreceiverID;
    //         this.shippersReceivers[0].receivers.dropOffLocation =
    //           d.receiversdropOffLocation;
    //         this.shippersReceivers[0].receivers.dropOffDate =
    //           d.receiversdropOffDate;
    //         this.shippersReceivers[0].receivers.dropOffTime =
    //           d.receiversdropOffTime;
    //         this.shippersReceivers[0].receivers.dropOffInstruction =
    //           d.receiversdropOffInstruction;

    //         this.orderData.charges.freightFee.amount = d.freightFeeamount;
    //         this.orderData.charges.freightFee.currency = d.freightFeecurrency;
    //         this.orderData.charges.freightFee.type = d.freightFeetype;

    //       }
    //     })
    // )
    // .subscribe((v: any) => {
    // });
  }
  cancel() {
    this.location.back();
  }
  goBack() {
    this.router.navigate([
      `/dispatch/orders/order-list/${this.routeManagement.orderUpdated()}`,
    ]); // <-- go back to previous location on cancel
  }
  async getCarrierState() {
    let carrierID = localStorage.getItem("xfhCarrierId");
    let result: any = await this.apiService
      .getData(`carriers/${carrierID}`)
      .toPromise();
    let carrierAddress = result.Items[0].addressDetails;
    let defaultAddress = [];
    for (let index = 0; index < carrierAddress.length; index++) {
      const element = carrierAddress[index];
      if (element.defaultYard != undefined && element.defaultYard) {
        defaultAddress.push(element);
      }
    }
    return defaultAddress;
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  async ngOnInit() {
    await this.fetchZones();
    await this.getFuelSurcharge();
    this.listService.fetchCustomers();
    this.disableButton();

    $(".modal").on("hidden.bs.modal", (e) => {
      localStorage.setItem("isOpen", "false");
    });

    this.getOrderID = this.route.snapshot.params["orderID"];
    if (this.getOrderID) {
      this.getShipperReceiverEdit();
      this.fetchOrderByID();

      this.pageTitle = `Edit Order`;
    } else {
      this.pageTitle = "Add Order";
      // this.fetchStateTaxes();

      this.getShippers();
      this.getReceivers();
      this.listService.fetchContactsByIDs();
      this.listService.contactsObjectDataSource.subscribe((res) => {
        this.receiversObjects = res;
        this.shippersObjects = res;
      });
    }
    this.httpClient.get("assets/packagingUnit.json").subscribe((data) => {
      this.packagingUnitsList = data;
    });

    // this.customers = this.listService.customersList;
    // this.receivers = this.listService.receiverList;

    this.route.queryParams.subscribe((params) => {
      this.cloneID = params.cloneID;
      if (this.cloneID != undefined && this.cloneID != "") {
        this.pageTitle = "Clone Order";
        this.cloneOrder(this.cloneID);
      }
    });

    this.route.queryParams.subscribe((params) => {
      const recallStatus = params.state;
      if (recallStatus) {
        this.recalledState = true;
      }
    });
    if (!this.getOrderID) {
      this.getOrderPrefix();
    }

    let customerList = new Array<any>();
    this.getValidCustomers(customerList);
    this.customers = customerList;
  }

  async getFuelSurcharge() {
    const fuelSurcharge = await this.apiService
      .getData(`fuelEntries/surcharge/latest`)
      .toPromise();
    if (fuelSurcharge.length > 0) {
      this.ltlSurcharge = fuelSurcharge[0].ltl;
      this.ftlSurcharge = fuelSurcharge[0].tl;
    }
  }

  async fetchZones() {
    const zones = await this.apiService.getData("zone/all/list").toPromise();
    this.zoneList = zones;
  }

  async getShippers() {
    if (this.shippers.length === 0) {
      this.listService.fetchShippers();
      let shipperList = new Array<any>();
      this.getValidShippers(shipperList);
      this.shippers = shipperList;
    }
  }

  async getReceivers() {
    if (this.receivers.length === 0) {
      this.listService.fetchReceivers();
      let receiverList = new Array<any>();
      this.getValidReceivers(receiverList);
      this.receivers = receiverList;
      console.log(this.receivers.length);
    }
  }

  getShipperReceiverEdit() {
    this.apiService
      .getData(`contacts/get/forOrder/${this.getOrderID}`)
      .subscribe((result: any) => {
        let newShippers = [];
        let newReceivers = [];
        if (result && result.length > 0) {
          for (const item of result) {
            if (item.isDeleted === 0 && item.eTypes.includes("shipper")) {
              newShippers.push(item);
            }
            if (item.isDeleted === 0 && item.eTypes.includes("receiver")) {
              newReceivers.push(item);
            }
          }

          this.shippersObjects = newShippers.reduce((a: any, b: any) => {
            return (a[b["contactID"]] = b["companyName"]), a;
          }, {});
          this.receiversObjects = newReceivers.reduce((a: any, b: any) => {
            return (a[b["contactID"]] = b["companyName"]), a;
          }, {});
        }
      });
  }

  private getValidCustomers(customerList: any[]) {
    let ids = [];
    this.listService.customersList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.contactID)) {
          customerList.push(element2);
          ids.push(element2.contactID);
        }
      });
    });
  }

  private getValidShippers(shipperList: any[]) {
    let ids = [];
    this.listService.shipperList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.contactID)) {
          shipperList.push(element2);
          ids.push(element2.contactID);
        }
      });
    });
  }

  private getValidReceivers(receiverList: any[]) {
    let ids = [];
    this.listService.receiverList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.contactID)) {
          receiverList.push(element2);
          ids.push(element2.contactID);
        }
      });
    });
  }

  async fetchStateTaxes() {
    let result = await this.apiService.getData("stateTaxes").toPromise();
    this.stateTaxes = result.Items;
    if (!this.getOrderID && !this.cloneID) {
      let getAddress = await this.getCarrierState();
      let data: any;
      if (getAddress.length > 0) {
        data = this.stateTaxes.filter(
          (elem) => elem.stateCode === getAddress[0].stateCode
        );
      } else {
        data = this.stateTaxes;
      }
      if (data && data.length > 0) {
        this.orderData.stateTaxID = data[0].stateTaxID;

        this.orderData.taxesInfo = [
          {
            name: "GST",
            amount: data[0].GST,
          },
          {
            name: "HST",
            amount: data[0].HST,
          },
          {
            name: "PST",
            amount: data[0].PST,
          },
        ];
      }
    } else if (!this.getOrderID && this.cloneID) {
      this.stateTaxes.map((v: any) => {
        if (this.orderData.stateTaxID == v.stateTaxID) {
          this.orderData.taxesInfo = [
            {
              name: "GST",
              amount: v.GST,
            },
            {
              name: "HST",
              amount: v.HST,
            },
            {
              name: "PST",
              amount: v.PST,
            },
          ];
        }
      });
    } else {
      this.stateTaxes.map((v: any) => {
        if (this.orderData.stateTaxID == v.stateTaxID) {
          this.orderData.taxesInfo = [
            {
              name: "GST",
              amount: v.GST,
            },
            {
              name: "HST",
              amount: v.HST,
            },
            {
              name: "PST",
              amount: v.PST,
            },
          ];
        }
      });
    }

    this.newTaxes = this.orderData.taxesInfo;
    if (this.subTotal > 0) {
      for (let i = 0; i < this.newTaxes.length; i++) {
        const element = this.newTaxes[i];
        element.taxAmount = (this.subTotal * element.amount) / 100;
      }
    }
  }

  resetSearch() {
    if (this.searchResults.length > 0) {
      this.searchResults = [];
    }
  }

  driverLoadChange(i, value) {
    this.shippersReceivers[i].shippers.driverLoad = value;
  }

  driverUnLoadChange(i, value) {
    this.shippersReceivers[i].receivers.driverUnload = value;
  }

  manualAddress(value, i, w, arr) {
    if (arr === "shipper") {
      if (value === true) {
        this.shippersReceivers[i].shippers.pickupPoint[
          w
        ].address.pickupLocation = null;
      }
      this.shippersReceivers[i].shippers.pickupPoint[w].address.address = "";
      this.shippersReceivers[i].shippers.pickupPoint[w].address.cityName = "";
      this.shippersReceivers[i].shippers.pickupPoint[w].address.stateCode = "";
      this.shippersReceivers[i].shippers.pickupPoint[w].address.stateName = "";
      this.shippersReceivers[i].shippers.pickupPoint[w].address.countryCode =
        "";
      this.shippersReceivers[i].shippers.pickupPoint[w].address.countryName =
        "";
      this.shippersReceivers[i].shippers.pickupPoint[w].address.zipCode = "";
      this.shippersReceivers[i].shippers.pickupPoint[w].address.geoCords = {};
    } else {
      if (value === true) {
        this.shippersReceivers[i].receivers.dropPoint[
          w
        ].address.dropOffLocation = null;
      }
      this.shippersReceivers[i].receivers.dropPoint[w].address.address = "";
      this.shippersReceivers[i].receivers.dropPoint[w].address.cityName = "";
      this.shippersReceivers[i].receivers.dropPoint[w].address.stateCode = "";
      this.shippersReceivers[i].receivers.dropPoint[w].address.stateName = "";
      this.shippersReceivers[i].receivers.dropPoint[w].address.countryCode = "";
      this.shippersReceivers[i].receivers.dropPoint[w].address.countryName = "";
      this.shippersReceivers[i].receivers.dropPoint[w].address.zipCode = "";
      this.shippersReceivers[i].receivers.dropPoint[w].address.geoCords = {};
    }
  }

  async saveShipper(i: number) {
    // this.isShipperSubmit = true;
    //check if all required fields are filled
    // $("#poErr_" + i).hide();
    let newPicks = this.shippersReceivers[i].shippers;
    if (!newPicks.shipperID) {
      this.toastr.error("Please select shipper");
      return false;
    }
    for (const pick of newPicks.pickupPoint) {
      if (pick.address.manual) {
        if (
          !pick.address.address ||
          !pick.address.cityName ||
          !pick.address.stateCode ||
          !pick.address.countryCode ||
          !pick.address.zipCode ||
          !pick.pickupDate ||
          !pick.pickupTime ||
          !pick.commodity[0].name
        ) {
          this.toastr.error("Please fill required fields.");
          return false;
        }
      } else if (
        !pick.address.pickupLocation ||
        !pick.pickupDate ||
        !pick.pickupTime ||
        !pick.commodity[0].name
      ) {
        this.toastr.error("Please fill required fields.");
        return false;
      }
    }

    let newPosData = [];

    for (
      let index = 0;
      index < this.shippersReceivers[i].shippers.pickupPoint.length;
      index++
    ) {
      const element = this.shippersReceivers[i].shippers.pickupPoint[index];
      for (let k = 0; k < element.customerPO.length; k++) {
        const po = element.customerPO[k];
        newPosData.push(po.label);
      }
      element.newCustomerPO = newPosData;
    }

    if (this.shippersReceivers[i].shippers.update == true) {
      this.shippersReceivers[i].shippers.update == false;
      this.shippersReceivers[i].shippers.save == true;
    }

    let data: any = {};
    for (
      let index = 0;
      index < this.shippersReceivers[i].shippers.pickupPoint.length;
      index++
    ) {
      const element = this.shippersReceivers[i].shippers.pickupPoint[index];
      if (element.address.manual === true) {
        data = {
          address: element.address.address,
          cityName: element.address.cityName,
          stateName: element.address.stateName,
          countryName: element.address.countryName,
          zipCode: element.address.zipCode,
        };

        $("#adrsErr1_" + i).css("display", "none");
        let result = await this.newGeoCode(data);

        if (result == null) {
          $("#adrsErr1_" + i).css("display", "block");
          this.toastr.error("Please add valid address");
          return false;
        }
        if (result != undefined || result != null) {
          element.address.geoCords = result;
        }
      }

      if (element.pickupDate != "" && element.pickupTime) {
        element["dateAndTime"] = element.pickupDate + " " + element.pickupTime;
        delete element.pickupDate;
        delete element.pickupTime;
      }
    }

    let currentShipper: any = {
      shipperID: this.shippersReceivers[i].shippers.shipperID,
      pickupPoint: this.shippersReceivers[i].shippers.pickupPoint,
      driverLoad: this.shippersReceivers[i].shippers.driverLoad,
      liveLoad: this.shippersReceivers[i].shippers.liveLoad,
    };
    this.finalShippersReceivers[i].shippers.push(currentShipper);
    this.orderData.shippersReceiversInfo = this.finalShippersReceivers;
    this.shippersReceivers[i].shippers.isShow = false;

    setTimeout(() => {
      $("html, body").animate(
        { scrollTop: $("#shipList_" + i).position().top },
        "slow"
      );
    }, 500);

    await this.shipperReceiverMerge();
    await this.getMiles(this.orderData.milesInfo.calculateBy);
    this.toastr.success("Shipper added successfully.");
    await this.emptyShipper(i);
  }

  async newGeoCode(data: any) {
    let result = await this.apiService
      .getData(`pcMiles/geocoding/${encodeURIComponent(JSON.stringify(data))}`)
      .toPromise();

    if (result.items != undefined && result.items.length > 0) {
      return result.items[0].position;
    }
  }

  async reverseGeoCode(cords: any) {
    this.apiService
      .getData(`pcMiles/reverse/${cords}`)
      .subscribe((result: any) => {
        if (result.length > 0) {
          return result[0].Coords;
        }
      });
  }

  async getCords(value) {
    let platform = new H.service.Platform({
      apikey: this.apiKey,
    });
    const service = platform.getSearchService();
    if (value !== "") {
      let result = await service.geocode({ q: value });
      return result.items[0];
    }
  }
  async saveReceiver(i) {
    // this.isReceiverSubmit = true;
    let newDrops = this.shippersReceivers[i].receivers;
    if (!newDrops.receiverID) {
      this.toastr.error("Please select receiver");
      return false;
    }
    for (const drop of newDrops.dropPoint) {
      if (drop.address.manual) {
        if (
          !drop.address.address ||
          !drop.address.cityName ||
          !drop.address.stateCode ||
          !drop.address.countryCode ||
          !drop.address.zipCode ||
          !drop.dropOffDate ||
          !drop.dropOffTime ||
          !drop.commodity[0].name
        ) {
          this.toastr.error("Please fill required fields.");
          return false;
        }
      } else if (
        !drop.address.dropOffLocation ||
        !drop.dropOffDate ||
        !drop.dropOffTime ||
        !drop.commodity[0].name
      ) {
        this.toastr.error("Please fill required fields.");
        return false;
      }
    }

    if (this.shippersReceivers[i].receivers.update == true) {
      this.shippersReceivers[i].receivers.update == false;
      this.shippersReceivers[i].receivers.save == true;
    }

    let data: any = {};

    for (
      let index = 0;
      index < this.shippersReceivers[i].receivers.dropPoint.length;
      index++
    ) {
      const element = this.shippersReceivers[i].receivers.dropPoint[index];

      if (element.address.manual === true) {
        data = {
          address: element.address.address,
          cityName: element.address.cityName,
          stateName: element.address.stateName,
          countryName: element.address.countryName,
          zipCode: element.address.zipCode,
        };

        $("#adrsErr2_" + i).css("display", "none");
        let result = await this.newGeoCode(data);

        if (result == null) {
          $("#adrsErr2_" + i).css("display", "block");
          this.toastr.error("Please add valid address");
          return false;
        }
        if (result != undefined || result != null) {
          element.address.geoCords = result;
        }
      }

      if (element.dropOffDate != "" && element.dropOffTime) {
        element["dateAndTime"] =
          element.dropOffDate + " " + element.dropOffTime;
        delete element.dropOffDate;
        delete element.dropOffTime;
      }
    }

    let currentReceiver: any = {
      receiverID: this.shippersReceivers[i].receivers.receiverID,
      dropPoint: this.shippersReceivers[i].receivers.dropPoint,
      driverUnload: this.shippersReceivers[i].receivers.driverUnload,
      liveUnLoad: this.shippersReceivers[i].receivers.liveUnLoad,
    };

    this.finalShippersReceivers[i].receivers.push(currentReceiver);
    this.orderData.shippersReceiversInfo = this.finalShippersReceivers;
    this.shippersReceivers[i].receivers.isShow = false;
    setTimeout(() => {
      $("html, body").animate(
        { scrollTop: $("#receiveList_" + i).position().top },
        "slow"
      );
    }, 500);
    await this.shipperReceiverMerge();
    this.toastr.success("Receiver added successfully.");
    await this.getMiles(this.orderData.milesInfo.calculateBy);
    await this.emptyReceiver(i);
    await this.calculateZonePrice();
  }

  async calculateZonePrice() {
    let rate = 0;
    let currency = "CAD";
    let aspRate = {};
    for (const shipRec of this.orderData.shippersReceiversInfo) {
      for (const receiver of shipRec.receivers) {
        for (const drop of receiver.dropPoint) {
          if (drop.zone.aspRates || drop.zone.pRates) {
            for (const commodity of drop.commodity) {
              if (commodity.quantityUnit == "Pallets") {
                const quantity: any = commodity.quantity;
                const priceObj = drop.zone.pRates.find(
                  (o) => o.noPallets == quantity
                );
                if (priceObj.rate) {
                  currency = priceObj.currency;
                  const calculatedPrice = Number(priceObj.rate);
                  rate += calculatedPrice;
                }
              }
            }
          }
        }
      }
    }
    this.orderData.charges.freightFee.type = "Flat Fee";
    this.orderData.charges.freightFee.amount = rate;
    this.orderData.charges.freightFee.currency = currency;
    let surcharge = 0;
    if (this.orderData.orderMode === "FTL") {
      surcharge = (rate * this.ftlSurcharge) / 100;
    } else {
      surcharge = (rate * this.ltlSurcharge) / 100;
    }
    this.orderData.charges.fuelSurcharge.type = "Flat Fee";
    this.orderData.charges.fuelSurcharge.currency = "CAD";
    this.orderData.charges.fuelSurcharge.amount = surcharge;
    await this.calculateAmount();
  }
  async shipperReceiverMerge() {
    this.mergedArray = [];
    this.finalShippersReceivers.forEach((item) => {
      item.shippers.forEach((elem) => {
        elem.pickupPoint.forEach((point) => {
          this.mergedArray.push(point);
        });
      });
      item.receivers.forEach((elem) => {
        elem.dropPoint.forEach((point) => {
          this.mergedArray.push(point);
        });
      });
    });

    this.mergedArray.sort((a, b) => {
      return (
        new Date(a.dateAndTime).valueOf() - new Date(b.dateAndTime).valueOf()
      );
    });
  }

  async emptyReceiver(i) {
    this.shippersReceivers[i].receivers.receiverID = null;
    this.shippersReceivers[i].receivers.dropPoint = [
      {
        unit: false,
        unitNumber: "",
        address: {
          address: "",
          manual: false,
          dropOffLocation: "",
          cityName: "",
          stateCode: "",
          stateName: "",
          countryName: "",
          countryCode: "",
          cities: [],
          states: [],
          zipCode: "",
          geoCords: {},
        },
        dropOffDate: "",
        dropOffTime: "",
        zone: {
          zoneID: null,
          zName: null,
          pRates: null,
          aspRates: null,
        },
        dropOffInstruction: "",
        contactPerson: "",
        phone: "",

        commodity: [
          {
            name: "",
            quantity: "",
            quantityUnit: null,
            weight: "",
            weightUnit: null,
            del: "",
          },
        ],
      },
    ];
    (this.shippersReceivers[i].receivers.driverUnload = false),
      (this.shippersReceivers[i].receivers.save = true),
      (this.shippersReceivers[i].receivers.update = false);
    this.shippersReceivers[i].receivers.isShow = false;
  }

  async emptyShipper(i) {
    this.shippersReceivers[i].shippers.shipperID = null;
    this.customerPOs = [];
    this.shippersReceivers[i].shippers.pickupPoint = [
      {
        unit: false,
        unitNumber: "",
        address: {
          address: "",
          manual: false,
          pickupLocation: "",
          cityName: "",
          stateCode: "",
          stateName: "",
          countryName: "",
          countryCode: "",
          cities: [],
          states: [],
          zipCode: "",
          geoCords: {},
        },
        pickupDate: "",
        pickupTime: "",
        pickupInstruction: "",
        customerPO: [],
        newCustomerPO: [],
        contactPerson: "",
        phone: "",

        commodity: [
          {
            name: "",
            quantity: "",
            quantityUnit: null,
            weight: "",
            weightUnit: null,
            pu: "",
          },
        ],
      },
    ];
    (this.shippersReceivers[i].shippers.driverLoad = false),
      (this.shippersReceivers[i].shippers.liveLoad = true),
      (this.shippersReceivers[i].shippers.save = true),
      (this.shippersReceivers[i].shippers.update = false);
    this.shippersReceivers[i].shippers.isShow = false;
  }

  /*
   * Selecting files before uploading
   */
  selectDocuments(event) {
    let files = [...event.target.files];
    let filesSize = 0;
    if (files.length > 5) {
      this.toastr.error("files count limit exceeded");
      this.photoSizeError = "files should not be more than 5";
      return;
    }

    for (let i = 0; i < files.length; i++) {
      filesSize += files[i].size / 1024 / 1024;
      if (filesSize > 10) {
        this.toastr.error("files size limit exceeded");
        return;
      } else {
        let name = files[i].name.split(".");
        let ext = name[name.length - 1].toLowerCase();
        if (
          ext == "doc" ||
          ext == "docx" ||
          ext == "pdf" ||
          ext == "jpg" ||
          ext == "jpeg" ||
          ext == "png"
        ) {
          this.uploadedDocs.push(files[i]);
        } else {
          this.photoSizeError =
            "Only .doc, .docx, .pdf, .jpg, .jpeg and png files allowed.";
        }
      }
    }
  }

  getTimeFormat(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  async getMiles(value) {
    this.getAllCords = [];
    let flag = true;
    let flag1 = true;
    // check if exiting accoridan has atleast one shipper and one receiver

    for (let k = 0; k < this.finalShippersReceivers.length; k++) {
      let shippers = this.finalShippersReceivers[k].shippers;
      let receivers = this.finalShippersReceivers[k].receivers;

      if (shippers.length == 0) flag = false;
      if (receivers.length == 0) flag1 = false;
    }

    if (!flag && !flag1 && (value == "google" || value == "pcmiles")) {
      this.toastr.error(
        "Please add atleast one Shipper and Receiver in shipments."
      );

      setTimeout(() => {
        $(".milesCommon").removeClass("active");
        this.orderData.milesInfo.calculateBy = "manual";
        $("#manual").addClass("active");
      }, 200);

      return false;
    }

    this.orderData.milesInfo["calculateBy"] = value;
    if (this.mergedArray !== undefined) {
      this.mergedArray.forEach((element) => {
        let cords = `${element.address.geoCords.lng},${element.address.geoCords.lat}`;
        this.getAllCords.push(cords);
      });

      if (value === "google") {
        // this.mergedArray.forEach((element) => {
        //   this.googleCords.push({
        //     lat: element.position.lat,
        //     lng: element.position.lng,
        //   });
        // });
        // this.origin = this.googleCords[0];
        // this.googleCords.shift();
        // this.destination = this.googleCords;
        // //
        // this.orderData.milesInfo.totalMiles = await this.google.googleDistance([this.origin], this.destination);
        //
      } else if (value === "pcmiles") {
        //
        //
        this.apiService
          .getData(
            "trips/calculate/pc/miles?type=mileReport&vehType=Truck&stops=" +
              this.getAllCords.join(";")
          )
          .subscribe(
            (result) => {
              if (result != undefined && result != "") {
                this.orderData.milesInfo["totalMiles"] = result;
              } else {
                this.orderData.milesInfo["totalMiles"] = 0;
              }
            },
            (err) => {
              // console.log("pc miles", err);
            }
          );
      } else {
        this.orderData.milesInfo["totalMiles"] = "";
      }
      this.getAllCords = [];
    }
  }

  selectedCustomer(customerID: any) {
    this.orderData.additionalContact = null;
    this.orderData.phone = "";
    this.orderData.email = "";

    this.apiService
      .getData(`contacts/detail/${customerID}`)
      .subscribe((result: any) => {
        if (result.Items.length > 0) {
          this.customerSelected = result.Items;
          for (let i = 0; i < this.customerSelected[0].adrs.length; i++) {
            const element = this.customerSelected[0].adrs[i];
            element["isChecked"] = false;
          }
          this.customerSelected[0].adrs[0].isChecked = true;
          if (result.Items[0].addlCnt != undefined) {
            this.cusAdditionalContact = result.Items[0].addlCnt;
            if (
              this.cusAdditionalContact.length === 1 &&
              this.cusAdditionalContact[0].fName == ""
            ) {
              this.cusAdditionalContact = [];
            }
          }

          if (
            this.customerSelected[0].adrs.length > 0 &&
            !this.getOrderID &&
            !this.cloneID
          ) {
            this.orderData.cusAddressID =
              this.customerSelected[0].adrs[0].addressID;
            let newCountCode = this.customerSelected[0].adrs[0].cCode;
            this.changeCusCurrency(newCountCode);
          }

          let addressLength = this.customerSelected[0].adrs.length;
          let getType = this.customerSelected[0].adrs[0].add1;
          let getC_Code = this.customerSelected[0].adrs[0].cCode;

          if (
            addressLength === 1 &&
            (getType == "" || getType == null) &&
            (getC_Code == "" || getC_Code == null)
          ) {
            this.notOfficeAddress = true;
          } else {
            this.notOfficeAddress = false;
          }
          if (this.getOrderID) {
            this.customerSelected[0].adrs.filter((elem) => {
              if (elem.addressID === this.orderData.cusAddressID) {
                elem.isChecked = true;
              }
              // address id doesnot match when address deleted from address book of particular entry
              if (
                this.customerSelected[0].adrs.length === 1 &&
                elem.addressID != this.orderData.cusAddressID
              ) {
                this.orderData.cusAddressID = elem.addressID;
              }
            });
          }
        }
      });
  }

  changeCusCurrency(value) {
    if (value === "CA") {
      this.orderData.charges.freightFee.currency = "CAD";
      this.orderData.charges.fuelSurcharge.currency = "CAD";
      this.accessFeesInfo.accessFees.forEach((elem) => {
        elem.currency = "CAD";
      });
      this.accessorialDeductionInfo.accessDeductions.forEach((elem) => {
        elem.currency = "CAD";
      });
    } else {
      this.orderData.charges.freightFee.currency = "USD";
      this.orderData.charges.fuelSurcharge.currency = "USD";
      this.accessFeesInfo.accessFees.forEach((elem) => {
        elem.currency = "USD";
      });
      this.accessorialDeductionInfo.accessDeductions.forEach((elem) => {
        elem.currency = "USD";
      });
    }
  }

  setAdditionalContact(event) {
    for (let i = 0; i < this.cusAdditionalContact.length; i++) {
      const element = this.cusAdditionalContact[i];
      if (element.flName == event) {
        this.orderData.phone = element.phone;
        this.orderData.email = element.email;
      } else {
        this.orderData.phone = null;
        this.orderData.email = null;
      }
    }
  }

  addCommodity(arr: string, parentIndex: number, i: number) {
    if (arr === "shipper") {
      this.shippersReceivers[parentIndex].shippers.pickupPoint[
        i
      ].commodity.push({
        name: "",
        quantity: "",
        quantityUnit: "",
        weight: "",
        weightUnit: "",
        pu: "",
      });
      // let ttlLen = this.shippersReceivers[parentIndex].shippers.pickupPoint[i].commodity.length -1;
      // let lastItem = this.shippersReceivers[parentIndex].shippers.pickupPoint[i].commodity[ttlLen];
      // if(lastItem.name != '' && lastItem.pu != '' && lastItem.quantity != '' && lastItem.quantityUnit != null && lastItem.weight != '' && lastItem.quantityUnit != null) {
      //   this.shippersReceivers[parentIndex].shippers.pickupPoint[i].commodity.push({
      //     name: '',
      //     quantity: '',
      //     quantityUnit: '',
      //     weight: '',
      //     weightUnit: '',
      //     pu : ''
      //   });
      // }
    } else {
      this.shippersReceivers[parentIndex].receivers.dropPoint[i].commodity.push(
        {
          name: "",
          quantity: "",
          quantityUnit: "",
          weight: "",
          weightUnit: "",
          del: "",
        }
      );
      // let ttlLen = this.shippersReceivers[parentIndex].receivers.dropPoint[i].commodity.length -1;
      // let lastItem = this.shippersReceivers[parentIndex].receivers.dropPoint[i].commodity[ttlLen];
      // if(lastItem.name != '' && lastItem.del != '' && lastItem.quantity != '' && lastItem.quantityUnit != null && lastItem.weight != '' && lastItem.quantityUnit != null) {
      //   this.shippersReceivers[parentIndex].receivers.dropPoint[i].commodity.push({
      //     name: '',
      //     quantity: '',
      //     quantityUnit: '',
      //     weight: '',
      //     weightUnit: '',
      //     del: ''
      //   });
      // }
    }
  }

  removeCommodity(obj: string, parentIndex: number, w: number, i: number) {
    if (obj === "shipper") {
      this.shippersReceivers[parentIndex].shippers.pickupPoint[
        w
      ].commodity.splice(i, 1);
    } else {
      this.shippersReceivers[parentIndex].receivers.dropPoint[
        w
      ].commodity.splice(i, 1);
    }
  }

  toggleAccordian(ind) {
    if (this.visibleIndex === ind) {
      this.visibleIndex = -1;
    } else {
      this.visibleIndex = ind;
    }
  }

  onChangeUnitType(type: string, value: any) {
    if (type === "order") {
      this.orderData["orderMode"] = value;
    } else {
      this.orderData["tripType"] = value;
    }
  }

  checkTrailer(value: boolean) {
    if (value) {
      this.orderData.additionalDetails["trailerType"] = "";
    }
  }

  checkFormErrors() {
    if (
      !this.orderData.customerID ||
      !this.orderData.orderNumber ||
      !this.orderData.charges.freightFee.type ||
      !this.orderData.charges.freightFee.amount ||
      !this.orderData.charges.freightFee.currency ||
      !this.orderData.milesInfo.totalMiles ||
      !this.orderData.milesInfo.calculateBy
    ) {
      //
      return false;
    }

    //
    return true;
  }

  async onSubmit() {
    if (this.orderData.zeroRated) {
      this.orderData.taxesInfo.forEach((element) => {
        element.taxAmount = 0;
      });
    }

    this.submitDisabled = true;

    if (
      this.orderData.additionalContact != null &&
      this.orderData.additionalContact.label != undefined &&
      this.orderData.additionalContact.label != null
    ) {
      this.orderData.additionalContact = this.orderData.additionalContact.label;
    }
    this.orderData.shippersReceiversInfo = this.finalShippersReceivers;
    this.orderData.cusPOs = this.cusPOs;
    let flag = true;
    let flag1 = true;
    // check if exiting accoridan has atleast one shipper and one receiver
    for (let k = 0; k < this.finalShippersReceivers.length; k++) {
      let shippers = this.finalShippersReceivers[k].shippers;
      let receivers = this.finalShippersReceivers[k].receivers;

      if (shippers.length == 0) flag = false;
      if (receivers.length == 0) flag1 = false;
    }

    if (!flag && !flag1) {
      this.toastr.error(
        "Please add at least one Shipper and Receiver in shipments."
      );
      return false;
    }

    if (this.isConfirmExist) {
      setTimeout(() => {
        $("html, body").animate(
          { scrollTop: $("#confirmErr").position().top },
          "slow"
        );
      }, 500);
      this.submitDisabled = false;
      return;
    }

    for (let i = 0; i < this.orderData.shippersReceiversInfo.length; i++) {
      const element = this.orderData.shippersReceiversInfo[i];
      for (let j = 0; j < element.shippers.length; j++) {
        const ship = element.shippers[j];
        for (let l = 0; l < ship.pickupPoint.length; l++) {
          const newPick = ship.pickupPoint[l];
          delete newPick.address.states;
          delete newPick.address.cities;
        }
      }

      for (let x = 0; x < element.receivers.length; x++) {
        const newReceive = element.receivers[x];
        for (let l = 0; l < newReceive.dropPoint.length; l++) {
          const newDrop = newReceive.dropPoint[l];
          delete newDrop.address.states;
          delete newDrop.address.cities;
        }
      }
    }

    //for location search in listing page
    let selectedLoc = "";
    let newloc = "";

    for (let g = 0; g < this.orderData.shippersReceiversInfo.length; g++) {
      const element = this.orderData.shippersReceiversInfo[g];
      element.receivers.map((h: any) => {
        h.dropPoint.map((elem) => {
          if (elem.address.manual) {
            newloc = `${elem.address.address} ${elem.address.cityName} ${elem.address.stateName} ${elem.address.countryName} ${elem.address.zipCode}`;
            selectedLoc += newloc.replace(/,/g, "").toLowerCase() + "|";
          } else {
            newloc = elem.address.dropOffLocation.replace(/,/g, "");
            selectedLoc += newloc.toLowerCase() + "|";
          }
        });
      });

      element.shippers.map((h: any) => {
        h.pickupPoint.map((elem) => {
          if (elem.address.manual) {
            newloc = `${elem.address.address} ${elem.address.cityName} ${elem.address.stateName} ${elem.address.countryName} ${elem.address.zipCode}`;
            selectedLoc += newloc.replace(/,/g, "").toLowerCase() + "|";
          } else {
            newloc = elem.address.pickupLocation.replace(/,/g, "");
            selectedLoc += newloc.toLowerCase() + "|";
          }
          if (elem.newCustomerPO != undefined) {
            elem.customerPO = elem.newCustomerPO;
            delete elem.newCustomerPO;
          }
        });
      });
    }

    this.orderData["loc"] = selectedLoc;
    this.orderData.orderNumber = this.orderData.orderNumber.toString();
    this.orderData.cusConfirmation = this.orderData.cusConfirmation
      ? this.orderData.cusConfirmation
      : "NA";

    // create form data instance
    const formData = new FormData();

    //append docs if any
    for (let j = 0; j < this.uploadedDocs.length; j++) {
      formData.append("uploadedDocs", this.uploadedDocs[j]);
    }

    console.log(this.orderData);
    //append other fields
    formData.append("data", JSON.stringify(this.orderData));

    this.apiService.postData("orders", formData, true).subscribe({
      complete: () => {},
      error: (err) => {
        this.submitDisabled = false;
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              if (path.includes("order")) {
                this.toastr.error(val.message);
              }
              const key = val.message.match(/"([^']+)"/)[1];
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[key] = val.message;
              if (key == "order") {
                this.toastr.error("This Order already exists.");
              }
              //
            })
          )
          .subscribe({
            complete: () => {
              // this.throwErrors();
              this.Success = "";
              this.submitDisabled = false;
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => {},
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.toastr.success("Order added successfully");
        this.goBack();
      },
    });
  }

  throwErrors() {
    from(Object.keys(this.errors)).subscribe((v) => {
      $('[name="' + v + '"]')
        .after(
          '<label id="' +
            v +
            '-error" class="error" for="' +
            v +
            '">' +
            this.errors[v] +
            "</label>"
        )
        .addClass("error");
    });
    // this.vehicleForm.showErrors(this.errors);
  }

  hideErrors() {
    from(Object.keys(this.errors)).subscribe((v) => {
      $('[name="' + v + '"]')
        .removeClass("error")
        .next()
        .remove("label");
    });
    this.errors = {};
  }

  remove(data, i) {
    if (data === "shipper") {
      // this.orderData.shipperInfo.splice(i, 1);
    } else {
      // this.orderData.receiverInfo.splice(i, 1);
    }
  }

  changeTax(value) {
    if (!value && this.stateTaxes.length === 0) {
      this.fetchStateTaxes();
    }
    this.calculateAmount();
  }

  async calculateAmount() {
    this.freightFee = this.orderData.charges.freightFee["amount"];
    this.fuelSurcharge = this.orderData.charges.fuelSurcharge["amount"];
    let sum = 0;

    this.accessFeesInfo.accessFees.forEach((item: any) => {
      sum += parseFloat(item.amount) || 0;
    });
    this.orderData.charges.accessorialFeeInfo["total"] = sum;
    this.orderData.charges.accessorialFeeInfo.accessorialFee =
      this.accessFeesInfo.accessFees;

    let totalDeductions = 0;
    this.accessorialDeductionInfo.accessDeductions.forEach((item: any) => {
      sum -= parseFloat(item.amount) || 0;
      totalDeductions += parseFloat(item.amount) || 0;
    });

    this.orderData.charges.accessorialDeductionInfo["total"] = totalDeductions;
    this.orderData.charges.accessorialDeductionInfo.accessorialDeduction =
      this.accessorialDeductionInfo.accessDeductions;

    sum +=
      (parseFloat(this.freightFee) || 0) +
      (parseFloat(this.fuelSurcharge) || 0);

    this.subTotal = sum.toFixed(2);

    // let discountAmount = parseFloat(this.orderData.discount["amount"]) || 0;
    // let discountUnit = this.orderData.discount["unit"];
    // if (discountUnit === "percentage") {
    //   this.discount = (this.subTotal * discountAmount) / 100;
    // } else {
    //   this.discount = discountAmount;
    // }

    this.totalAmount = this.subTotal;

    this.orderData["totalAmount"] = this.totalAmount;
    this.orderData.finalAmount = this.totalAmount;
    if (!this.orderData.zeroRated) {
      let gst = this.orderData.taxesInfo[0].amount
        ? this.orderData.taxesInfo[0].amount
        : 0;
      let pst = this.orderData.taxesInfo[1].amount
        ? this.orderData.taxesInfo[1].amount
        : 0;
      let hst = this.orderData.taxesInfo[2].amount
        ? this.orderData.taxesInfo[2].amount
        : 0;
      let advance: any = this.orderData.advance;
      let totalTax = parseFloat(gst) + parseFloat(pst) + parseFloat(hst);
      let taxAmount = (parseFloat(this.totalAmount) * totalTax) / 100;
      let final: any = (parseFloat(this.totalAmount) + taxAmount).toFixed(2);
      this.orderData["totalAmount"] = final;

      this.totalAmount = final;
      this.orderData.finalAmount = final - parseFloat(advance);
    }
    this.newTaxes = this.orderData.taxesInfo;
    if (this.subTotal > 0) {
      for (let i = 0; i < this.newTaxes.length; i++) {
        const element = this.newTaxes[i];
        element.taxAmount = (this.subTotal * element.amount) / 100;
      }
    }
  }

  async removeList(elem, parentIndex, i) {
    if (elem === "shipper") {
      this.finalShippersReceivers[parentIndex].shippers.splice(i, 1);
      this.shippersReceivers[parentIndex].shippers.update = false;
      this.shippersReceivers[parentIndex].shippers.save = true;
      if (this.finalShippersReceivers[parentIndex].shippers.length === 0) {
        this.shippersReceivers[parentIndex].shippers.isShow = true;
      }
    } else {
      this.finalShippersReceivers[parentIndex].receivers.splice(i, 1);
      this.shippersReceivers[parentIndex].receivers.update = false;
      this.shippersReceivers[parentIndex].receivers.save = true;
      if (this.finalShippersReceivers[parentIndex].receivers.length === 0) {
        this.shippersReceivers[parentIndex].receivers.isShow = true;
      }
    }
    await this.shipperReceiverMerge();
    await this.getMiles(this.orderData.milesInfo.calculateBy);

    this.showShipperUpdate = false;
    this.showReceiverUpdate = false;
  }

  assignLocation(i: number, w: number, value: any, id: string) {
    let getAddress;
    if (value === "shipper") {
      getAddress = this.shipAddresses.filter((elem) => elem.addressID == id);
    }
    if (value === "shipper") {
      if (getAddress.length > 0) {
        if (getAddress[0].manual) {
          let newAddress = "";
          if (getAddress[0].add1 != undefined && getAddress[0].add1 != "") {
            newAddress = `${getAddress[0].add1}`;
          }
          if (getAddress[0].add2 != undefined && getAddress[0].add2 != "") {
            if (newAddress != "") {
              newAddress += `, ${getAddress[0].add2}`;
            } else {
              newAddress += `${getAddress[0].add2}`;
            }
          }
          if (
            getAddress[0].ctyName != undefined &&
            getAddress[0].ctyName != ""
          ) {
            newAddress += `, ${getAddress[0].ctyName}`;
          }
          if (getAddress[0].sName != undefined && getAddress[0].sName != "") {
            newAddress += `, ${getAddress[0].sName}`;
          }
          if (getAddress[0].cName != undefined && getAddress[0].cName != "") {
            newAddress += `, ${getAddress[0].cName}`;
          }
          if (getAddress[0].zip != undefined && getAddress[0].zip != "") {
            newAddress += `. ${getAddress[0].zip}`;
          }

          this.shippersReceivers[i].shippers.pickupPoint[
            w
          ].address.pickupLocation = newAddress;
        } else {
          this.shippersReceivers[i].shippers.pickupPoint[
            w
          ].address.pickupLocation = getAddress[0].userLoc;
        }

        this.shippersReceivers[i].shippers.pickupPoint[w].address.geoCords =
          getAddress[0].geoCords;
        this.shippersReceivers[i].shippers.pickupPoint[w].address.cityName =
          getAddress[0].ctyName;
        this.shippersReceivers[i].shippers.pickupPoint[w].address.stateCode =
          getAddress[0].sCode;
        this.shippersReceivers[i].shippers.pickupPoint[w].address.stateName =
          getAddress[0].sName;
        this.shippersReceivers[i].shippers.pickupPoint[w].address.countryCode =
          getAddress[0].cCode;
        this.shippersReceivers[i].shippers.pickupPoint[w].address.countryName =
          getAddress[0].cName;
        this.shippersReceivers[i].shippers.pickupPoint[w].address.zipCode =
          getAddress[0].zip;
      }
    } else {
      let getAddress = this.receiverAddresses.filter(
        (elem) => elem.addressID == id
      );
      if (getAddress.length > 0) {
        if (getAddress[0].manual) {
          let newAddress = "";
          if (getAddress[0].add1 != undefined && getAddress[0].add1 != "") {
            newAddress = `${getAddress[0].add1}`;
          }
          if (getAddress[0].add2 != undefined && getAddress[0].add2 != "") {
            if (newAddress != "") {
              newAddress += `, ${getAddress[0].add2}`;
            } else {
              newAddress += `${getAddress[0].add2}`;
            }
          }
          if (
            getAddress[0].ctyName != undefined &&
            getAddress[0].ctyName != ""
          ) {
            newAddress += `, ${getAddress[0].ctyName}`;
          }
          if (getAddress[0].sName != undefined && getAddress[0].sName != "") {
            newAddress += `, ${getAddress[0].sName}`;
          }
          if (getAddress[0].cName != undefined && getAddress[0].cName != "") {
            newAddress += `, ${getAddress[0].cName}`;
          }
          if (getAddress[0].zip != undefined && getAddress[0].zip != "") {
            newAddress += `. ${getAddress[0].zip}`;
          }
          this.shippersReceivers[i].receivers.dropPoint[
            w
          ].address.dropOffLocation = newAddress;
        } else {
          this.shippersReceivers[i].receivers.dropPoint[
            w
          ].address.dropOffLocation = getAddress[0].userLoc;
        }

        this.shippersReceivers[i].receivers.dropPoint[w].address.geoCords =
          getAddress[0].geoCords;
        this.shippersReceivers[i].receivers.dropPoint[w].address.cityName =
          getAddress[0].ctyName;
        this.shippersReceivers[i].receivers.dropPoint[w].address.stateCode =
          getAddress[0].sCode;
        this.shippersReceivers[i].receivers.dropPoint[w].address.stateName =
          getAddress[0].sName;
        this.shippersReceivers[i].receivers.dropPoint[w].address.countryCode =
          getAddress[0].cCode;
        this.shippersReceivers[i].receivers.dropPoint[w].address.countryName =
          getAddress[0].cName;
        this.shippersReceivers[i].receivers.dropPoint[w].address.zipCode =
          getAddress[0].zip;
      }
    }
    $("div").removeClass("show-search__result");
  }

  addPickUpPoint(i, obj) {
    if (obj == "shipper") {
      this.shippersReceivers[i].shippers.pickupPoint.push({
        unit: false,
        unitNumber: "",
        address: {
          address: "",
          manual: false,
          pickupLocation: "",
          cityName: "",
          stateName: "",
          stateCode: "",
          countryName: "",
          countryCode: "",
          zipCode: "",
          cities: [],
          states: [],
          geoCords: {},
        },
        pickupDate: "",
        pickupTime: "",
        pickupInstruction: "",
        contactPerson: "",
        phone: "",
        customerPO: [],
        newCustomerPO: [],
        commodity: [
          {
            name: "",
            quantity: "",
            quantityUnit: null,
            weight: "",
            weightUnit: null,
            pu: "",
          },
        ],
      });
    } else {
      this.shippersReceivers[i].receivers.dropPoint.push({
        unit: false,
        unitNumber: "",
        address: {
          address: "",
          manual: false,
          dropOffLocation: "",
          cityName: "",
          stateName: "",
          stateCode: "",
          countryName: "",
          countryCode: "",
          zipCode: "",
          cities: [],
          states: [],
          geoCords: {},
        },
        dropOffDate: "",
        dropOffTime: "",
        dropOffInstruction: "",
        zone: {
          zoneID: null,
          zName: null,
          pRates: null,
          aspRates: null,
        },
        contactPerson: "",
        phone: "",
        commodity: [
          {
            name: "",
            quantity: "",
            quantityUnit: null,
            weight: "",
            weightUnit: null,
            del: "",
          },
        ],
      });
    }
  }

  // viewList(elem: string, j: number, i: number) {
  //   this.editList(elem, j, i);
  //   if (elem === "shipper") {
  //     this.shippersReceivers[j].shippers.update = false;
  //   } else {
  //     this.shippersReceivers[j].receivers.update = false;
  //   }

  // }

  editList(elem, parentIndex, i) {
    let j = parentIndex;

    if (elem === "shipper") {
      let data = this.finalShippersReceivers[parentIndex].shippers[i];
      this.shippersReceivers[j].shippers.shipperID = data.shipperID;
      // let newPosData = [];
      // data.pickupPoint.forEach((element) => {
      //   element.customerPO.forEach((po: any) => {
      //     newPosData.push({ label: po });
      //   });
      //   element.customerPO = newPosData;
      // });
      this.shippersReceivers[j].shippers.pickupPoint = data.pickupPoint;
      for (
        let index = 0;
        index < this.shippersReceivers[j].shippers.pickupPoint.length;
        index++
      ) {
        const element = this.shippersReceivers[j].shippers.pickupPoint[index];
        if (
          element["dateAndTime"] != undefined ||
          element["dateAndTime"] != ""
        ) {
          let itemDateAndTime = element["dateAndTime"].split(" ");
          element.pickupDate = itemDateAndTime[0];
          element.pickupTime = itemDateAndTime[1];
        }
      }

      this.shippersReceivers[j].shippers.driverLoad = data.driverLoad;
      this.shippersReceivers[j].shippers.save = false;
      this.shippersReceivers[j].shippers.update = true;
      this.shippersReceivers[j].shippers.isShow = true;
      this.stateShipperIndex = i;
      this.showShipperUpdate = true;
      this.getShippers();
    } else {
      let data = this.finalShippersReceivers[parentIndex].receivers[i];
      this.shippersReceivers[j].receivers.receiverID = data.receiverID;
      this.shippersReceivers[j].receivers.dropPoint = data.dropPoint;
      for (
        let index = 0;
        index < this.shippersReceivers[j].receivers.dropPoint.length;
        index++
      ) {
        const element = this.shippersReceivers[j].receivers.dropPoint[index];
        if (
          element["dateAndTime"] != undefined ||
          element["dateAndTime"] != ""
        ) {
          let itemDateAndTime = element["dateAndTime"].split(" ");
          element.dropOffDate = itemDateAndTime[0];
          element.dropOffTime = itemDateAndTime[1];
        }
      }
      this.shippersReceivers[j].receivers.driverUnload = data.driverUnload;

      this.shippersReceivers[j].receivers.save = false;
      this.shippersReceivers[j].receivers.update = true;
      this.shippersReceivers[j].receivers.isShow = true;
      this.stateReceiverIndex = i;
      this.getReceivers();
    }
    this.visibleIndex = i;
    this.showReceiverUpdate = true;
  }

  async updateShipperReceiver(obj, i) {
    if (obj === "shipper") {
      // for shipper
      $("#poErr_" + i).hide();
      let newPicks = this.shippersReceivers[i].shippers;
      if (!newPicks.shipperID) {
        this.toastr.error("Please select shipper");
        return false;
      }
      for (const pick of newPicks.pickupPoint) {
        if (pick.address.manual) {
          if (
            !pick.address.address ||
            !pick.address.cityName ||
            !pick.address.stateCode ||
            !pick.address.countryCode ||
            !pick.address.zipCode ||
            !pick.pickupDate ||
            !pick.pickupTime ||
            !pick.commodity[0].name
          ) {
            this.toastr.error("Please fill required fields.");
            return false;
          }
        } else if (
          !pick.address.pickupLocation ||
          !pick.pickupDate ||
          !pick.pickupTime ||
          !pick.commodity[0].name
        ) {
          this.toastr.error("Please fill required fields.");
          return false;
        }
      }
      let data = this.shippersReceivers[i].shippers;
      this.finalShippersReceivers[i].shippers[
        this.stateShipperIndex
      ].shipperID = data.shipperID;
      let newPosData = [];
      data.pickupPoint.forEach((element) => {
        element.customerPO.forEach((po: any) => {
          if (po && po != null) {
            newPosData.push(po.label);
          }
        });
        element.newCustomerPO = newPosData;
      });
      this.finalShippersReceivers[i].shippers[
        this.stateShipperIndex
      ].pickupPoint = data.pickupPoint;
      let location: any;

      for (
        let index = 0;
        index <
        this.finalShippersReceivers[i].shippers[this.stateShipperIndex]
          .pickupPoint.length;
        index++
      ) {
        const element = this.shippersReceivers[i].shippers.pickupPoint[index];
        if (element.address.manual === true) {
          location = {
            address: element.address.address,
            cityName: element.address.cityName,
            stateName: element.address.stateName,
            countryName: element.address.countryName,
            zipCode: element.address.zipCode,
          };

          $("#adrsErr1_" + i).css("display", "none");
          let result = await this.newGeoCode(location);
          if (result == null) {
            $("#adrsErr1_" + i).css("display", "block");
            this.toastr.error("Please add valid address");
            return false;
          }
          if (result != undefined || result != null) {
            element.address.geoCords = result;
          }
        }

        element["dateAndTime"] = element.pickupDate + " " + element.pickupTime;
        delete element.pickupDate;
        delete element.pickupTime;
      }

      this.finalShippersReceivers[i].shippers[
        this.stateShipperIndex
      ].driverLoad = data.driverLoad;
      this.showShipperUpdate = false;
      data.save = true;
      data.update = false;
      data.isShow = false;

      this.toastr.success("Shipper Updated successfully.");
      setTimeout(() => {
        $("html, body").animate(
          { scrollTop: $("#shipList_" + i).position().top },
          "slow"
        );
      }, 500);
      this.emptyShipper(i);
    } else {
      // for receiver
      let newDrops = this.shippersReceivers[i].receivers;
      if (!newDrops.receiverID) {
        this.toastr.error("Please select receiver");
        return false;
      }
      for (const drop of newDrops.dropPoint) {
        if (drop.address.manual) {
          if (
            !drop.address.address ||
            !drop.address.cityName ||
            !drop.address.stateCode ||
            !drop.address.countryCode ||
            !drop.address.zipCode ||
            !drop.dropOffDate ||
            !drop.dropOffTime ||
            !drop.commodity[0].name
          ) {
            this.toastr.error("Please fill required fields.");
            return false;
          }
        } else if (
          !drop.address.dropOffLocation ||
          !drop.dropOffDate ||
          !drop.dropOffTime ||
          !drop.commodity[0].name
        ) {
          this.toastr.error("Please fill required fields.");
          return false;
        }
      }
      let data = this.shippersReceivers[i].receivers;

      delete this.finalShippersReceivers[i].receivers[this.stateReceiverIndex]
        .dropOffDate;
      delete this.finalShippersReceivers[i].receivers[this.stateReceiverIndex]
        .dropOffTime;

      this.finalShippersReceivers[i].receivers[
        this.stateReceiverIndex
      ].receiverID = data.receiverID;
      this.finalShippersReceivers[i].receivers[
        this.stateReceiverIndex
      ].dropPoint = data.dropPoint;
      let location: any;
      let allDropPoints =
        this.finalShippersReceivers[i].receivers[this.stateReceiverIndex]
          .dropPoint;
      for (let index = 0; index < allDropPoints.length; index++) {
        const element = this.shippersReceivers[i].receivers.dropPoint[index];

        if (element.address.manual === true) {
          location = {
            address: element.address.address,
            cityName: element.address.cityName,
            stateName: element.address.stateName,
            countryName: element.address.countryName,
            zipCode: element.address.zipCode,
          };

          $("#adrsErr2_" + i).css("display", "none");
          let result = await this.newGeoCode(location);
          if (result == null) {
            $("#adrsErr2_" + i).css("display", "block");
            this.toastr.error("Please add valid address");
            return false;
          }
          if (result != undefined || result != null) {
            element.address.geoCords = result;
          }
        }

        element["dateAndTime"] =
          element.dropOffDate + " " + element.dropOffTime;
        delete element.dropOffDate;
        delete element.dropOffTime;
      }

      this.finalShippersReceivers[i].receivers[
        this.stateReceiverIndex
      ].driverUnload = data.driverUnload;
      this.showReceiverUpdate = false;

      data.save = true;
      data.update = false;
      data.isShow = false;
      this.toastr.success("Receiver updated successfully.");
      setTimeout(() => {
        $("html, body").animate(
          { scrollTop: $("#receiveList_" + i).position().top },
          "slow"
        );
      }, 500);
      this.emptyReceiver(i);
    }

    await this.shipperReceiverMerge();
    await this.getMiles(this.orderData.milesInfo.calculateBy);
    this.visibleIndex = -1;
  }

  addShipReceiver(obj: string, i: any) {
    let length = this.shippersReceivers.length;
    if (obj == "shipper") {
      this.shippersReceivers[i].shippers.isShow = true;
      this.getShippers();
    } else {
      this.shippersReceivers[i].receivers.isShow = true;
      this.getReceivers();
    }
  }

  disableButton() {
    if (
      this.orderData.customerID == "" ||
      this.orderData.customerID == null ||
      this.finalShippersReceivers[0].receivers.length == 0 ||
      this.finalShippersReceivers[0].shippers.length == 0 ||
      this.orderData.milesInfo.calculateBy == "" ||
      this.orderData.milesInfo.totalMiles == null ||
      this.orderData.milesInfo.totalMiles == "" ||
      this.orderData.charges.freightFee.type == "" ||
      this.orderData.charges.freightFee.type == null ||
      this.orderData.charges.freightFee.amount == null ||
      this.orderData.charges.freightFee.currency == "" ||
      this.orderData.charges.freightFee.currency == null
    ) {
      return true;
    } else {
      return false;
    }
  }

  /***************
   * For Edit Orders
   */
  async fetchOrderByID() {
    this.apiService
      .getData("orders/" + this.getOrderID)
      .subscribe(async (result: any) => {
        result = result.Items[0];
        this.orderData.cusAddressID = result.cusAddressID;
        if (!result.zeroRated) {
          await this.fetchStateTaxes();
        }

        let state = this.stateTaxes.find(
          (o) => o.stateTaxID == result.stateTaxID
        );

        if (result.recptStat) {
          this.recalledState = false;
        }
        this.orderData.taxesInfo = [
          {
            name: "GST",
            amount: state ? state.GST : "",
          },
          {
            name: "HST",
            amount: state ? state.HST : "",
          },
          {
            name: "PST",
            amount: state ? state.PST : "",
          },
        ];
        this.orderData["recptStat"] = result.recptStat
          ? result.recptStat
          : false;
        this.orderData["customerID"] = result.customerID;
        this.orderData.cusConfirmation =
          result.cusConfirmation == "NA" ? "" : result.cusConfirmation;
        this.selectedCustomer(result.customerID);

        if (result.attachments !== undefined && result.attachments.length > 0) {
          this.orderAttachments = result.attachments.map((x) => ({
            path: `${this.Asseturl}/${result.carrierID}/${x}`,
            name: x,
          }));
        }
        if (result.brkAmount) {
          this.orderData["brkAmount"] = result.brkAmount;
        }
        if (result.brkCarrID) {
          this.orderData["brkCarrID"] = result.brkCarrID;
        }
        if (result.brkIns) {
          this.orderData["brkIns"] = result.brkIns;
        }
        this.orderData.tripData = result.tripData;
        this.orderData["attachments"] = result.attachments;
        this.ifStatus = result.orderStatus;
        this.orderData.orderStatus = result.orderStatus;
        this.orderData.tripData = result.tripData;
        this.orderData["zeroRated"] = result.zeroRated;
        this.orderData["additionalContact"] = result.additionalContact;
        this.orderData["createdDate"] = result.createdDate;
        this.orderData["createdTime"] = result.createdTime;
        this.isInvoiceGenerated = result.invoiceGenerate;
        this.orderData["invoiceGenerate"] = result.invoiceGenerate;
        this.orderData["invoiceEmail"] = result.invoiceEmail;
        this.orderData["csa"] = result.csa;
        this.orderData["ctpat"] = result.ctpat;
        this.orderData["customerPO"] = result.customerPO;
        this.orderData["email"] = result.email;
        this.orderData["orderMode"] = result.orderMode;
        this.orderData["orderNumber"] = result.orderNumber;
        this.getOrderNumber = result.orderNumber;
        this.orderData["phone"] = result.phone;
        this.orderData["reference"] = result.reference;
        this.orderData["remarks"] = result.remarks;
        this.orderData.advance = result.advance;
        this.orderData.milesInfo["totalMiles"] = result.milesInfo.totalMiles;
        this.orderData.milesInfo["calculateBy"] = result.milesInfo.calculateBy;
        this.orderData.stateTaxID = result.stateTaxID;
        this.orderData["tripType"] = result.tripType;
        this.orderData.additionalDetails.sealNo =
          result.additionalDetails.sealNo;
        this.orderData.additionalDetails.sealType =
          result.additionalDetails.sealType;
        this.orderData.additionalDetails["trailerType"] =
          result.additionalDetails.trailerType;

        // this.orderData.additionalDetails["loadType"] =
        //   result.additionalDetails.loadType;

        this.orderData.additionalDetails["refeerTemp"] =
          result.additionalDetails.refeerTemp;

        if (result.invData) {
          this.orderData["invData"] = result.invData;
        }

        this.orderData.shippersReceiversInfo = result.shippersReceiversInfo;
        let shimentLength = result.shippersReceiversInfo.length;
        // this.shippersReceivers = result.shippersReceiversInfo;
        this.addShipReceiveLength(shimentLength - 1);

        this.finalShippersReceivers = result.shippersReceiversInfo;
        this.shippersReceivers.forEach((elem) => {
          elem.shippers.isShow = false;
          elem.receivers.isShow = false;
        });
        this.shipperReceiverMerge();

        this.orderData.charges.freightFee.amount =
          result.charges.freightFee.amount;
        this.orderData.charges.freightFee.currency =
          result.charges.freightFee.currency;
        this.orderData.charges.freightFee.type = result.charges.freightFee.type;
        this.orderData.charges.fuelSurcharge.amount =
          result.charges.fuelSurcharge.amount;
        this.orderData.charges.fuelSurcharge.currency =
          result.charges.fuelSurcharge.currency;
        this.orderData.charges.fuelSurcharge.type =
          result.charges.fuelSurcharge.type;

        let newAccessDeductions = [];
        for (
          let i = 0;
          i <
          result.charges.accessorialDeductionInfo.accessorialDeduction.length;
          i++
        ) {
          newAccessDeductions.push({
            type: result.charges.accessorialDeductionInfo.accessorialDeduction[
              i
            ].type,
            currency:
              result.charges.accessorialDeductionInfo.accessorialDeduction[i]
                .currency,
            amount:
              result.charges.accessorialDeductionInfo.accessorialDeduction[i]
                .amount,
          });
        }
        this.accessorialDeductionInfo.accessDeductions = newAccessDeductions;

        let newAccessFees = [];
        for (
          let i = 0;
          i < result.charges.accessorialFeeInfo.accessorialFee.length;
          i++
        ) {
          newAccessFees.push({
            type: result.charges.accessorialFeeInfo.accessorialFee[i].type,
            amount: result.charges.accessorialFeeInfo.accessorialFee[i].amount,
            currency:
              result.charges.accessorialFeeInfo.accessorialFee[i].currency,
          });
        }
        this.accessFeesInfo.accessFees = newAccessFees;

        this.orderData.advance = result.amount;
        this.orderData.discount.unit = result.discount.unit;
        this.orderData["totalAmount"] = result.totalAmount;
        this.orderData.advance = result.advance;
        this.existingUploadedDocs = result.uploadedDocs;
        this.orderData.cusPOs = result.cusPOs;
        this.cusPOs = result.cusPOs;
        this.calculateAmount();
      });
  }

  addShipReceiveLength(length) {
    for (let index = 0; index < length; index++) {
      this.shippersReceivers.push({
        shippers: {
          shipperID: null,
          pickupPoint: [
            {
              unit: false,
              unitNumber: "",
              address: {
                address: "",
                manual: false,
                pickupLocation: "",
                cityName: "",
                stateCode: "",
                stateName: "",
                countryCode: "",
                countryName: "",
                zipCode: "",
                cities: [],
                states: [],
                geoCords: {},
              },
              pickupDate: "",
              pickupTime: "",
              pickupInstruction: "",
              contactPerson: "",
              phone: "",
              customerPO: [],
              newCustomerPO: [],
              commodity: [
                {
                  name: "",
                  quantity: "",
                  quantityUnit: null,
                  weight: "",
                  weightUnit: null,
                  pu: "",
                },
              ],
            },
          ],
          driverLoad: false,
          liveLoad: true,
          save: true,
          update: false,
          isShow: true,
        },
        receivers: {
          receiverID: null,
          dropPoint: [
            {
              unit: false,
              unitNumber: "",
              address: {
                address: "",
                manual: false,
                dropOffLocation: "",
                cityName: "",
                stateCode: "",
                stateName: "",
                countryCode: "",
                countryName: "",
                zipCode: "",
                cities: [],
                states: [],
                geoCords: {},
              },
              dropOffDate: "",
              dropOffTime: "",
              dropOffInstruction: "",
              contactPerson: "",
              zone: {
                zoneID: null,
                zName: null,
                pRates: null,
                aspRates: null,
              },
              phone: "",
              commodity: [
                {
                  name: "",
                  quantity: "",
                  quantityUnit: null,
                  weight: "",
                  weightUnit: null,
                  del: "",
                },
              ],
            },
          ],

          driverUnload: false,
          liveUnLoad: true,
          save: true,
          update: false,
          isShow: true,
        },
      });
    }
  }

  async updateOrder(type) {
    // this.isSubmit = true;
    // if (!this.checkFormErrors()) return false;
    this.submitDisabled = true;
    if (this.orderData.zeroRated) {
      this.orderData.taxesInfo.forEach((element) => {
        element.taxAmount = 0;
      });
    }
    this.orderData.shippersReceiversInfo = this.finalShippersReceivers;
    this.orderData["uploadedDocs"] = this.existingUploadedDocs;
    this.orderData["orderID"] = this.getOrderID;
    this.orderData.orderNumber = this.orderData.orderNumber.toString();
    this.orderData["deletedFiles"] = this.deletedFiles;
    let flag = true;
    // check if exiting accoridan has atleast one shipper and one receiver
    for (let k = 0; k < this.finalShippersReceivers.length; k++) {
      let shippers = this.finalShippersReceivers[k].shippers;
      let receivers = this.finalShippersReceivers[k].receivers;

      if (shippers.length == 0) flag = false;
      if (receivers.length == 0) flag = false;
    }
    //for location search in listing page
    let selectedLoc = "";
    let newloc = "";
    for (let g = 0; g < this.orderData.shippersReceiversInfo.length; g++) {
      const element = this.orderData.shippersReceiversInfo[g];
      element.receivers.map((h: any) => {
        h.dropPoint.map((elem) => {
          if (elem.address.manual) {
            newloc = `${elem.address.address} ${elem.address.cityName} ${elem.address.stateName} ${elem.address.countryName} ${elem.address.zipCode}`;
            selectedLoc += newloc.replace(/,/g, "").toLowerCase() + "|";
          } else {
            newloc = elem.address.dropOffLocation.replace(/,/g, "");
            selectedLoc += newloc.toLowerCase() + "|";
          }
        });
      });

      element.shippers.map((h: any) => {
        h.pickupPoint.map((elem) => {
          if (elem.address.manual) {
            newloc = `${elem.address.address} ${elem.address.cityName} ${elem.address.stateName} ${elem.address.countryName} ${elem.address.zipCode}`;
            selectedLoc += newloc.replace(/,/g, "").toLowerCase() + "|";
          } else {
            newloc = elem.address.pickupLocation.replace(/,/g, "");
            selectedLoc += newloc.toLowerCase() + "|";
          }

          if (elem.newCustomerPO != undefined) {
            elem.customerPO = elem.newCustomerPO;
            delete elem.newCustomerPO;
          }
        });
      });
    }

    if (!flag) {
      this.toastr.error(
        "Please add atleast one Shipper and Receiver in shipments."
      );
      return false;
    }

    if (this.isConfirmExist) {
      setTimeout(() => {
        $("html, body").animate(
          { scrollTop: $("#confirmErr").position().top },
          "slow"
        );
      }, 500);
      this.submitDisabled = false;
      return;
    }

    for (let i = 0; i < this.orderData.shippersReceiversInfo.length; i++) {
      const element = this.orderData.shippersReceiversInfo[i];
      for (let j = 0; j < element.shippers.length; j++) {
        const ship = element.shippers[j];
        for (let l = 0; l < ship.pickupPoint.length; l++) {
          const newPick = ship.pickupPoint[l];
          delete newPick.address.states;
          delete newPick.address.cities;
        }
      }

      for (let x = 0; x < element.receivers.length; x++) {
        const newReceive = element.receivers[x];
        for (let l = 0; l < newReceive.dropPoint.length; l++) {
          const newDrop = newReceive.dropPoint[l];
          delete newDrop.address.states;
          delete newDrop.address.cities;
        }
      }
    }

    this.orderData["loc"] = selectedLoc;
    this.orderData.cusPOs = this.cusPOs;
    this.orderData.cusConfirmation = this.orderData.cusConfirmation
      ? this.orderData.cusConfirmation
      : "NA";

    // create form data instance
    const formData = new FormData();

    //append docs if any
    for (let j = 0; j < this.uploadedDocs.length; j++) {
      formData.append("uploadedDocs", this.uploadedDocs[j]);
    }

    //append other fields
    formData.append("data", JSON.stringify(this.orderData));

    let url = "";
    if (type === "") {
      url = "orders";
    } else if (type === "recall") {
      url = "admin/order/recall";
    }
    this.apiService.putData(url, formData, true).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              // this.throwErrors();
              this.Success = "";
              this.submitDisabled = false;
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => {},
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.toastr.success("Order updated successfully");
        // this.goBack();
        this.router.navigate([`/dispatch/orders/detail/${this.getOrderID}`]);
      },
    });
  }

  addAccordian() {
    let flag = true;

    // check if exiting accoridan has atleast one shipper and one receiver
    for (let k = 0; k < this.finalShippersReceivers.length; k++) {
      let shippers = this.finalShippersReceivers[k].shippers;
      let receivers = this.finalShippersReceivers[k].receivers;

      if (shippers.length == 0) flag = false;
      if (receivers.length == 0) flag = false;
    }

    if (!flag) {
      this.toastr.error(
        "Please add atleast one Shipper and Receiver in existing shipment."
      );
      return false;
    }

    let allFields = {
      shippers: {
        shipperID: null,
        pickupPoint: [
          {
            unit: false,
            unitNumber: "",
            address: {
              address: "",
              manual: false,
              pickupLocation: "",
              cityName: "",
              stateCode: "",
              stateName: "",
              countryCode: "",
              countryName: "",
              zipCode: "",
              cities: [],
              states: [],
              geoCords: {},
            },
            pickupDate: "",
            pickupTime: "",
            pickupInstruction: "",
            contactPerson: "",
            phone: "",
            customerPO: [],
            newCustomerPO: [],
            commodity: [
              {
                name: "",
                quantity: "",
                quantityUnit: null,
                weight: "",
                weightUnit: null,
                pu: "",
              },
            ],
          },
        ],
        driverLoad: false,
        liveLoad: true,
        save: true,
        update: false,
        isShow: true,
      },
      receivers: {
        receiverID: null,
        dropPoint: [
          {
            unit: false,
            unitNumber: "",
            address: {
              address: "",
              manual: false,
              dropOffLocation: "",
              cityName: "",
              stateCode: "",
              stateName: "",
              countryCode: "",
              countryName: "",
              zipCode: "",
              cities: [],
              states: [],
              geoCords: {},
            },
            dropOffDate: "",
            zone: {
              zoneID: null,
              zName: null,
              pRates: null,
              aspRates: null,
            },
            dropOffTime: "",
            dropOffInstruction: "",
            contactPerson: "",
            phone: "",
            commodity: [
              {
                name: "",
                quantity: "",
                quantityUnit: null,
                weight: "",
                weightUnit: null,
                del: "",
              },
            ],
          },
        ],

        driverUnload: false,
        liveUnLoad: true,
        save: true,
        update: false,
        isShow: true,
      },
    };
    let ttlLength = this.shippersReceivers.length;
    this.shippersReceivers.push(allFields);
    this.shippersReceivers[ttlLength].shippers.isShow = true;
    this.finalShippersReceivers.push({
      shippers: [],
      receivers: [],
    });
  }

  removeAccordian(i) {
    this.shippersReceivers.splice(i, 1);
    this.finalShippersReceivers.splice(i, 1);
  }

  searchFn(term: string, item: { name: string }) {
    return item.name.includes(term) && item.name !== term;
  }

  addAccessFee(value: string) {
    let curType = this.orderData.charges.freightFee.currency;
    if (value === "accessFee") {
      this.accessFeesInfo.accessFees.push({
        type: "",
        amount: 0,
        currency: curType,
      });
    } else {
      this.accessorialDeductionInfo.accessDeductions.push({
        type: "",
        amount: 0,
        currency: curType,
      });
    }
  }

  deleteAccessFee(value: string, index) {
    if (value === "accessFee") {
      this.accessFeesInfo.accessFees.splice(index, 1);
    } else {
      this.accessorialDeductionInfo.accessDeductions.splice(index, 1);
    }
  }

  tempChange(value) {
    this.orderData.additionalDetails.refeerTemp.maxTempratureUnit = value;
    this.orderData.additionalDetails.refeerTemp.minTempratureUnit = value;
  }

  changeCurrency(value) {
    this.orderData.charges.freightFee.currency = value;
    this.orderData.charges.fuelSurcharge.currency = value;

    this.accessFeesInfo.accessFees.forEach((item) => {
      item.currency = value;
    });

    this.accessorialDeductionInfo.accessDeductions.forEach((item) => {
      item.currency = value;
    });
  }

  async stateSelectChange() {
    let selected: any = this.stateTaxes.find(
      (o) => o.stateTaxID == this.orderData.stateTaxID
    );
    this.orderData.taxesInfo = [];

    this.orderData.taxesInfo = [
      {
        name: "GST",
        amount: selected.GST,
      },
      {
        name: "HST",
        amount: selected.HST,
      },
      {
        name: "PST",
        amount: selected.PST,
      },
    ];
    this.tax =
      (parseInt(selected.GST) ? selected.GST : 0) +
      (parseInt(selected.HST) ? selected.HST : 0) +
      (parseInt(selected.PST) ? selected.PST : 0);
    await this.calculateAmount();
  }

  caretClickShipper(i) {
    if (
      $("#shipperArea-" + i)
        .children("i")
        .hasClass("fa-caret-right")
    ) {
      $("#shipperArea-" + i)
        .children("i")
        .removeClass("fa-caret-right");
      $("#shipperArea-" + i)
        .children("i")
        .addClass("fa-caret-down");
    } else {
      $("#shipperArea-" + i)
        .children("i")
        .addClass("fa-caret-right");
      $("#shipperArea-" + i)
        .children("i")
        .removeClass("fa-caret-down");
    }
  }

  caretClickReceiver(i) {
    if (
      $("#receiverArea-" + i)
        .children("i")
        .hasClass("fa-caret-right")
    ) {
      $("#receiverArea-" + i)
        .children("i")
        .removeClass("fa-caret-right");
      $("#receiverArea-" + i)
        .children("i")
        .addClass("fa-caret-down");
    } else {
      $("#receiverArea-" + i)
        .children("i")
        .addClass("fa-caret-right");
      $("#receiverArea-" + i)
        .children("i")
        .removeClass("fa-caret-down");
    }
  }

  fetchLastOrderNumber() {
    this.apiService.getData("orders/get/last/orderNo").subscribe((result) => {
      this.orderData.orderNumber = result.toString();
    });
  }

  // assignReceiverValue(type, fieldName, fieldVaue, shipperInd, commIndex) {
  //   if(type == 'commodity') {
  //     if(fieldName == 'weightUnit' || fieldName == 'quantityUnit') {
  //       this.shippersReceivers[shipperInd].receivers.commodity[commIndex][fieldName] = fieldVaue;
  //     } else {
  //       this.shippersReceivers[shipperInd].receivers.commodity[commIndex][fieldName] = fieldVaue.target.value;
  //     }

  //   }
  // }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length - 1];
    this.pdfSrc = "";
    if (ext == "doc" || ext == "docx" || ext == "xlsx") {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(
        "https://docs.google.com/viewer?url=" + val + "&embedded=true"
      );
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  // delete uploaded images and documents
  delete(type: string, name: string, index) {
    let record = {
      eventID: this.getOrderID,
      type: type,
      name: name,
      date: this.orderData.createdDate,
      time: this.orderData.createdTime,
    };
    // this.apiService.postData(`orders/uploadDelete`, record).subscribe((result: any) => {

    // });
    this.deletedFiles.push(record);
    this.orderAttachments.splice(index, 1);
  }

  removePickUpPoint(i: number, w: number, obj: string) {
    if (obj == "shipper") {
      this.shippersReceivers[i].shippers.pickupPoint.splice(w, 1);
    } else {
      this.shippersReceivers[i].receivers.dropPoint.splice(w, 1);
    }
  }

  async getStates(countryCode: string, str: string, i: number, w: number) {
    let states = await this.countryStateCity.GetStatesByCountryCode([
      countryCode,
    ]);

    let countryName = await this.countryStateCity.GetSpecificCountryNameByCode(
      countryCode
    );
    if (str === "shipper") {
      this.shippersReceivers[i].shippers.pickupPoint[w].address.countryName =
        countryName;
      this.shippersReceivers[i].shippers.pickupPoint[w].address.states = states;
    } else {
      this.shippersReceivers[i].receivers.dropPoint[w].address.countryName =
        countryName;
      this.shippersReceivers[i].receivers.dropPoint[w].address.states = states;
    }
  }

  async getCities(stateCode: string, str: string, i: number, w: number) {
    if (str === "shipper") {
      let countryCode =
        this.shippersReceivers[i].shippers.pickupPoint[w].address.countryCode;
      let stateResult = await this.countryStateCity.GetStateNameFromCode(
        stateCode,
        countryCode
      );
      this.shippersReceivers[i].shippers.pickupPoint[w].address.stateName =
        stateResult;
      let cities = await this.countryStateCity.GetCitiesByStateCodes(
        countryCode,
        stateCode
      );
      this.shippersReceivers[i].shippers.pickupPoint[w].address.cities = cities;
    } else {
      let countryCode =
        this.shippersReceivers[i].receivers.dropPoint[w].address.countryCode;
      let stateResult = await this.countryStateCity.GetStateNameFromCode(
        stateCode,
        countryCode
      );
      this.shippersReceivers[i].receivers.dropPoint[w].address.stateName =
        stateResult;
      let cities = await this.countryStateCity.GetCitiesByStateCodes(
        countryCode,
        stateCode
      );
      this.shippersReceivers[i].receivers.dropPoint[w].address.cities = cities;
    }
  }

  getAddressID(value: boolean, i: number, id: string) {
    if (value === true) {
      this.orderData.cusAddressID = id;
      for (
        let index = 0;
        index < this.customerSelected[0].adrs.length;
        index++
      ) {
        const element = this.customerSelected[0].adrs[index];
        element.isChecked = false;
      }
      this.customerSelected[0].adrs[i].isChecked = true;
      let newCountCode = this.customerSelected[0].adrs[i].cCode;
      this.changeCusCurrency(newCountCode);
    }
  }

  public changeModalValue() {
    this.listService.changeButton(false);
  }

  shipperReceiverAddress(value, id) {
    if (value === "shipper") {
      this.shipAddresses = [];
    } else {
      this.receiverAddresses = [];
    }
    if (id != null) {
      this.apiService.getData(`contacts/detail/${id}`).subscribe((res) => {
        if (value === "shipper") {
          this.shipAddresses = [];
          if (
            res.Items[0].adrs.length === 1 &&
            (res.Items[0].adrs[0].add1 === "" ||
              res.Items[0].adrs[0].add1 === null) &&
            (res.Items[0].adrs[0].cCode === "" ||
              res.Items[0].adrs[0].cCode === null)
          ) {
            this.shipAddresses = [];
          } else {
            this.shipAddresses = res.Items[0].adrs;
          }
        } else {
          this.receiverAddresses = [];
          if (
            res.Items[0].adrs.length === 1 &&
            (res.Items[0].adrs[0].aType === "" ||
              res.Items[0].adrs[0].aType === null) &&
            (res.Items[0].adrs[0].cCode === "" ||
              res.Items[0].adrs[0].cCode === null)
          ) {
            this.receiverAddresses = [];
          } else {
            this.receiverAddresses = res.Items[0].adrs;
          }
        }
      });
    }
  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem("isOpen", "true");
    this.listService.changeButton(false);
  }

  fetchData(i: any, value: string) {
    if (value === "shipper") {
      if (
        this.shippersReceivers[i].shippers.shipperID != "" ||
        this.shippersReceivers[i].shippers.shipperID != null
      ) {
        let id = this.shippersReceivers[i].shippers.shipperID;
        this.shipperReceiverAddress("shipper", id);
      }
      this.listService.fetchShippers();
    } else if (value === "receiver") {
      if (
        this.shippersReceivers[i].receivers.receiverID != "" ||
        this.shippersReceivers[i].receivers.receiverID != null
      ) {
        let id = this.shippersReceivers[i].receivers.receiverID;
        this.shipperReceiverAddress("", id);
      }
      this.listService.fetchReceivers();
    } else if (value === "customer") {
      if (this.orderData.customerID != null) {
        let id = this.orderData.customerID;
        this.selectedCustomer(id);
      }
      this.listService.fetchCustomers();
    }
  }

  async cloneOrder(id: any) {
    this.apiService.getData("orders/" + id).subscribe(async (result: any) => {
      result = result.Items[0];
      this.orderData.cusAddressID = result.cusAddressID;
      await this.fetchStateTaxes();
      let state = this.stateTaxes.find(
        (o) => o.stateTaxID == result.stateTaxID
      );

      this.orderData.taxesInfo = [
        {
          name: "GST",
          amount: state ? state.GST : "",
        },
        {
          name: "HST",
          amount: state ? state.HST : "",
        },
        {
          name: "PST",
          amount: state ? state.PST : "",
        },
      ];
      this.orderData["customerID"] = result.customerID;
      this.selectedCustomer(result.customerID);

      if (result.attachments !== undefined && result.attachments.length > 0) {
        this.orderAttachments = result.attachments.map((x) => ({
          path: `${this.Asseturl}/${result.carrierID}/${x}`,
          name: x,
        }));
      }
      this.orderData["attachments"] = result.attachments;
      this.ifStatus = result.orderStatus;
      this.orderData.orderStatus = "created";
      this.orderData["zeroRated"] = result.zeroRated;
      this.orderData["additionalContact"] = result.additionalContact;
      this.orderData["createdDate"] = result.createdDate;
      this.orderData["createdTime"] = result.createdTime;
      this.isInvoiceGenerated = result.invoiceGenerate;
      this.orderData["invoiceEmail"] = result.invoiceEmail;
      this.orderData["csa"] = result.csa;
      this.orderData["ctpat"] = result.ctpat;
      this.orderData["customerPO"] = result.customerPO;
      this.orderData["email"] = result.email;
      this.orderData["orderMode"] = result.orderMode;
      // this.orderData["orderNumber"] = result.orderNumber;
      // this.getOrderNumber = result.orderNumber;
      this.orderData["phone"] = result.phone;
      this.orderData["reference"] = result.reference;
      this.orderData["remarks"] = result.remarks;
      this.orderData.advance = result.advance;
      this.orderData.milesInfo["totalMiles"] = result.milesInfo.totalMiles;
      this.orderData.milesInfo["calculateBy"] = result.milesInfo.calculateBy;
      this.orderData.stateTaxID = result.stateTaxID;
      this.orderData["tripType"] = result.tripType;
      this.orderData.additionalDetails.sealNo = result.additionalDetails.sealNo;
      this.orderData.additionalDetails.sealType =
        result.additionalDetails.sealType;
      this.orderData.additionalDetails["trailerType"] =
        result.additionalDetails.trailerType;

      // this.orderData.additionalDetails["loadType"] =
      //   result.additionalDetails.loadType;

      this.orderData.additionalDetails["refeerTemp"] =
        result.additionalDetails.refeerTemp;

      this.orderData.shippersReceiversInfo = result.shippersReceiversInfo;
      let shimentLength = result.shippersReceiversInfo.length;
      this.addShipReceiveLength(shimentLength - 1);

      this.finalShippersReceivers = result.shippersReceiversInfo;
      this.shippersReceivers.forEach((elem) => {
        elem.shippers.isShow = false;
        elem.receivers.isShow = false;
      });
      this.shipperReceiverMerge();

      // let newLoadTypes = [];
      // if (
      //   result.additionalDetails.loadType &&
      //   result.additionalDetails.loadType.length > 0
      // ) {
      //   for (let i = 0; i < result.additionalDetails.loadType.length; i++) {
      //     newLoadTypes.push(result.additionalDetails.loadType[i]);
      //   }
      //   this.loadTypeData = newLoadTypes;
      // }

      this.orderData.charges.freightFee.amount =
        result.charges.freightFee.amount;
      this.orderData.charges.freightFee.currency =
        result.charges.freightFee.currency;
      this.orderData.charges.freightFee.type = result.charges.freightFee.type;
      this.orderData.charges.fuelSurcharge.amount =
        result.charges.fuelSurcharge.amount;
      this.orderData.charges.fuelSurcharge.currency =
        result.charges.fuelSurcharge.currency;
      this.orderData.charges.fuelSurcharge.type =
        result.charges.fuelSurcharge.type;

      let newAccessDeductions = [];
      for (
        let i = 0;
        i < result.charges.accessorialDeductionInfo.accessorialDeduction.length;
        i++
      ) {
        newAccessDeductions.push({
          type: result.charges.accessorialDeductionInfo.accessorialDeduction[i]
            .type,
          currency:
            result.charges.accessorialDeductionInfo.accessorialDeduction[i]
              .currency,
          amount:
            result.charges.accessorialDeductionInfo.accessorialDeduction[i]
              .amount,
        });
      }
      this.accessorialDeductionInfo.accessDeductions = newAccessDeductions;

      let newAccessFees = [];
      for (
        let i = 0;
        i < result.charges.accessorialFeeInfo.accessorialFee.length;
        i++
      ) {
        newAccessFees.push({
          type: result.charges.accessorialFeeInfo.accessorialFee[i].type,
          amount: result.charges.accessorialFeeInfo.accessorialFee[i].amount,
          currency:
            result.charges.accessorialFeeInfo.accessorialFee[i].currency,
        });
      }
      this.accessFeesInfo.accessFees = newAccessFees;

      this.orderData.advance = result.amount;
      this.orderData.discount.unit = result.discount.unit;
      this.orderData["totalAmount"] = result.totalAmount;
      this.orderData.advance = result.advance;
      this.existingUploadedDocs = result.uploadedDocs;

      this.calculateAmount();
    });
  }

  addPos(pos) {
    this.cusPOs.push(pos.label);
  }

  removePos(pos) {
    let index = this.cusPOs.indexOf(pos.label);
    this.cusPOs.splice(index, 1);
  }

  validateConfirmation() {
    if (this.orderData.cusConfirmation !== "") {
      this.isConfirmExist = false;
      this.submitDisabled = true;

      this.orderData.cusConfirmation = this.orderData.cusConfirmation
        ? this.orderData.cusConfirmation.trim()
        : "NA";
      this.apiService
        .getData(
          `orders/validate/confirm?value=${this.orderData.cusConfirmation}`
        )
        .subscribe((result: any) => {
          if (result) {
            this.isConfirmExist = true;
            this.isConfirmData.orderNo = result.orderNo;
            this.isConfirmData.cusConfirmation = result.cusConfirmation;
            this.submitDisabled = false;
          } else {
            this.isConfirmExist = false;
            this.submitDisabled = false;
          }
        });
    }
  }

  async getOrderPrefix() {
    let result: any = await this.apiService
      .getData(`carriers/get/showPrefix?type=${"order"}`)
      .toPromise();
    if (result && result.length > 0) {
      this.orderData.orderNumber = `${result[0].prefix}${result[0].sequence}`;
    }
  }
  async searchZone(dropPoint: any, index: any, i: any) {
    if (
      this.shippersReceivers[i].receivers.dropPoint[index].zone.zoneID === null
    ) {
      const address = dropPoint.address;
      if (!address.geoCords.lat && !address.geoCords.lng) {
        const data = {
          address: address.address,
          cityName: address.cityName,
          stateName: address.address.stateName,
          countryName: address.countryName,
          zipCode: address.zipCode,
        };
        address.geoCords = await this.newGeoCode(data);
      }
      if (
        address.geoCords.lat &&
        address.geoCords.lng &&
        this.zoneList.length > 0
      ) {
        const geoCords = {
          latitude: address.geoCords.lat,
          longitude: address.geoCords.lng,
        };
        console.log(geoCords);
        for (const zone of this.zoneList) {
          if (zone.coordinates && zone.coordinates.length > 0) {
            const cordArray = [];
            for (const a of zone.coordinates) {
              const cordObject = { latitude: a.lat, longitude: a.lng };
              cordArray.push(cordObject);
            }
            if (isPointInPolygon(geoCords, cordArray)) {
              this.shippersReceivers[i].receivers.dropPoint[index].zone = {
                zoneID: zone.id,
                zName: zone.zName,
                pRates: zone.pRates,
                aspRates: zone.aspRates,
              };
              console.log(
                this.shippersReceivers[i].receivers.dropPoint[index].zone
              );
              return;
            }
          }
        }
      }
    }
  }
}
