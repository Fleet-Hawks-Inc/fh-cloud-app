const ct = require("countries-and-timezones");
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ApiService } from "../../../services/api.service";
import { from, Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { map } from "rxjs/operators";
import { ListService } from "../../../services";
import * as moment from "moment";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";


declare var $: any;
@Component({
  selector: "app-shared-modals",
  templateUrl: "./shared-modals.component.html",
  styleUrls: ["./shared-modals.component.css"],
})
export class SharedModalsComponent implements OnInit {
  @ViewChild("vehProgramModal", { static: true })
  vehProgramModal: TemplateRef<any>;
  @ViewChild("addDocType", { static: true })
  addDocType: TemplateRef<any>;
  @ViewChild("addIssueModal", { static: true }) addIssueModal: TemplateRef<any>;
  @ViewChild("assetModelsModal", { static: true })
  assetModelsModal: TemplateRef<any>;

  countriesList: any = [];
  countries: any = [];
  states: any = [];
  cities: any = [];
  manufacturers: any = [];
  models: any = [];
  assetManufacturers: any = [];
  assetModels: any = [];
  form: any;
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  private destroy$ = new Subject();
  errors = {};
  deletedAddress = [];
  allAssetTypes: any;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };

  submitDisabled: boolean = false;
  docs = {
    docType: null,
    uploadedDocs: [],
  };

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private listService: ListService
  ) {
    const date = new Date();
    this.getcurrentDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    this.birthDateMinLimit = {
      year: date.getFullYear() - 60,
      month: date.getMonth() + 12,
      day: date.getDate(),
    };
    this.birthDateMaxLimit = {
      year: date.getFullYear() - 18,
      month: date.getMonth() + 12,
      day: date.getDate(),
    };

    this.listService.fetchAppendIssues().subscribe((res) => {
      this.issuesData.unitID = res.name;
      this.issuesData.unitType = res.type;
      this.issuesData.odometer = res.odometer;
    });
  }
  errorAbstract = false;
  stateData = {
    countryID: "",
    stateName: "",
    stateCode: "",
  };
  cityData = {
    countryID: "",
    stateID: "",
    cityName: "",
  };
  vehicleMakeData = {
    manufacturerName: "",
  };
  vehicleModelData = {
    manufacturerID: "",
    modelName: "",
  };
  assetMakeData = {
    manufacturerName: "",
  };
  assetModelData = {
    manufacturerID: "",
    modelName: "",
  };
  test: any = [];
  statesObject: any;
  assets: any = [];

  fuelTypes = [];

  nullVar = null;
  abstractValid = false;
  isDocSubmit = false;
  prefixOutput: string;
  finalPrefix = "";
  currentUser: any;
  abstractDocs = [];
  uploadedDocs = [];
  isSubmitted = false;
  carrierID: any;
  carrierYards = [];
  absDocs = [];
  documentTypeList: any = [];
  cycles = [];
  ownerOperators: any = [];
  getcurrentDate: any;
  birthDateMinLimit: any;
  birthDateMaxLimit: any;
  countriesObject: any;
  fieldTextType: boolean;
  cpwdfieldTextType: boolean;
  licCountries: any = [];
  issueModal: any;

  // Issues variables ends
  issuesData = {
    issueName: "",
    currentStatus: "OPEN",
    unitID: "",
    unitType: "vehicle",
    reportedDate: moment().format("YYYY-MM-DD"),
    description: "",
    odometer: null,
    reportedBy: "",
    assignedTo: "",
  };

  /**
   * service program props
   */
  pageTitle: string;
  vehicleModal = false;
  vehicles: any = [];
  tasks = [];
  uploadedPhotos = [];
  private programID;
  serviceData = {
    programName: "",
    description: "",
    vehicles: [],
    serviceScheduleDetails: [
      {
        serviceTask: "",
        repeatByTime: "",
        repeatByTimeUnit: "",
        repeatByOdometer: "",
      },
    ],
  };

  taskData = {
    taskType: "service",
    taskName: "",
    description: "",
  };

  inspectionForms = [];
  groups = [];
  drivers: any = [];
  groupData = {
    groupName: "",
    groupType: "vehicles",
    description: "",
    groupMembers: [],
  };
  localPhotos = [];
  activeTab = 1;

  subscription: any;
  docSubscribe: any;
  users = [];

  getDocsLength: any;
  docModalRef: any;
  documentType: string;
  docError: string;
  async ngOnInit() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: false,
      windowClass: "doc-type__main",
    };
    this.listService.closeModalList.subscribe((res: any) => {
      if (res.mode == 'open') {
        this.docError = res.message;
      } if (res.mode == 'close' && res.message == undefined) {
        this.docModalRef.close()
        this.docs = {
          docType: null,
          uploadedDocs: [],
        };
      }
    })
    this.docSubscribe = this.listService.docModalList.subscribe((res: any) => {
      if (res.type === 'order' || res.type === 'trip') {
        this.documentType = res.type;
        this.getDocsLength = res.docLength;
        this.docError = '';
        this.isDocSubmit = false;
        this.docModalRef = this.modalService.open(this.addDocType, ngbModalOptions)
      }
    })

    this.fetchApis();

    $(document).ready(() => {
      this.form = $("#stateForm").validate();
      this.form = $("#cityForm").validate();
      this.form = $("#vehicleMakeForm").validate();
      this.form = $("#vehicleModelForm").validate();
      this.form = $("#assetMakeForm").validate();
      this.form = $("#assetModelForm").validate();
      this.form = $("#serviceProgramForm").validate();
    });
  }

  fetchApis() {
    this.subscription = this.listService.otherModelList.subscribe(
      (res: any) => {
        if (res === "veh-program") {
          let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: false,
            windowClass: "vehicle-prog__main",
          };
          const vehModal = this.modalService.open(
            this.vehProgramModal,
            ngbModalOptions
          );
          vehModal.result.then(
            (data) => {
              this.clearServiceProg();
              this.listService.separateModals("");
            },
            (reason) => {
              this.clearServiceProg();
              this.listService.separateModals("");
            }
          );
          this.fetchVehicles();
          this.fetchTasks();
        } else if (res === "logIssue") {
          let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: false,
            windowClass: "add-issue__main",
          };
          this.issueModal = this.modalService.open(
            this.addIssueModal,
            ngbModalOptions
          );
          this.issueModal.result.then(
            (data) => {
              this.clearIssueData();
              this.listService.separateModals("");
            },
            (reason) => {
              this.clearIssueData();
              this.listService.separateModals("");
            }
          );
          this.fetchVehicles();
          this.fetchAssets();
          this.fetchUsers();
        } else if (res === "") {
          this.issueModal.close();
        }
      }
    );
  }

  fetchInspectionForms() {
    this.apiService
      .getData("inspectionForms/type/vehicle")
      .subscribe((result: any) => {
        this.inspectionForms = result.Items;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.docSubscribe.unsubscribe();
  }

  fetchGroups() {
    this.apiService
      .getData(`groups/getGroup/${this.groupData.groupType}`)
      .subscribe((result: any) => {
        // this.groups = result.Items;
        result.Items.forEach((element) => {
          if (element.isDeleted === 0) {
            this.groups.push(element);
          }
        });
      });
  }

  fetchDrivers() {
    this.apiService.getData("drivers").subscribe((result: any) => {
      // this.drivers = result.Items;
      result.Items.forEach((element) => {
        if (element.isDeleted === 0) {
          this.drivers.push(element);
        }
      });
    });
  }

  fetchAssetModels() {
    this.apiService.getData("assetModels").subscribe((result: any) => {
      this.assetModels = result.Items;
    });
  }

  fetchAssets() {
    if (this.assets.length === 0) {
      this.apiService.getData("assets").subscribe((result: any) => {
        result.Items.forEach((element) => {
          if (element.isDeleted === 0) {
            this.assets.push(element);
          }
        });
      });
    }
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

  /**
   *   add vehicle model
   * */
  addVehicleModel() {
    this.hideErrors();
    this.apiService.postData("vehicleModels", this.vehicleModelData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        $("#addVehicleModelModal").modal("hide");
        this.toastr.success("Vehicle Model Added Successfully.");
        //this.listService.fetchModels();
      },
    });
  }

  /**
   * add asset make
   */

  addAssetMake() {
    this.hideErrors();
    this.apiService
      .postData("assetManufacturers", this.assetMakeData)
      .subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, "This Field");
                this.errors[val.context.key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          $("#addAssetMakeModal").modal("hide");
          this.toastr.success("Asset Make Added Successfully.");
          // this.listService.fetchAssetManufacturers();
        },
      });
  }
  /**
   * add asset model
   */
  // add vehicle model
  addAssetModel() {
    this.hideErrors();
    this.apiService.postData("assetModels", this.assetModelData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        $("#addAssetModelModal").modal("hide");
        this.toastr.success("Asset Model Added Successfully.");
        // this.listService.fetchAssetModels();
        this.assetModelData.manufacturerID = "";
        this.assetMakeData.manufacturerName = "";
      },
    });
  }

  addDocument() {
    this.serviceData.serviceScheduleDetails.push({
      serviceTask: "",
      repeatByTime: "",
      repeatByTimeUnit: "",
      repeatByOdometer: "",
    });
  }
  addServiceProgram() {
    this.hideErrors();
    this.apiService.postData("servicePrograms", this.serviceData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.listService.fetchServicePrograms();
        $("#addVehicleProgramModal").modal("hide");

        this.toastr.success("Service added successfully");
        this.modalService.dismissAll();
      },
    });
  }

  addServiceTask() {
    this.hideErrors();
    this.apiService.postData("tasks", this.taskData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.toastr.success("Service Task added successfully");
        $("#addServiceTaskModal").modal("hide");
        this.taskData["taskName"] = "";
        this.taskData["description"] = "";
        this.listService.fetchTasks();
      },
    });
  }

  fetchVehicles() {
    if (this.vehicles.length === 0) {

      this.apiService.getData("vehicles").subscribe({
        error: () => { },
        next: (result: any) => {


          result.Items.forEach((element) => {
            if (element.isDeleted === 0) {
              this.vehicles.push(element);
            }
          });
        },
      });
    }
  }
  fetchTasks() {
    this.apiService.getData(`tasks?type=service`).subscribe((result: any) => {
      this.tasks = result;
    });
  }

  removeTasks(i) {
    this.serviceData.serviceScheduleDetails.splice(i, 1);
  }

  async changeTab(value) {
    this.activeTab = value;
  }

  /*
   * Selecting files before uploading
   */
  selectDocuments(event, i) {
    let files = [...event.target.files];
    if (i != null) {
      if (this.uploadedDocs[i] == undefined) {
        this.uploadedDocs[i] = files;
      }
    } else {
      this.abstractDocs = [];
      this.abstractDocs = files;
    }
  }

  // Show password
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  togglecpwdfieldTextType() {
    this.cpwdfieldTextType = !this.cpwdfieldTextType;
  }

  onChangeHideErrors(fieldname = "") {
    $('[name="' + fieldname + '"]')
      .removeClass("error")
      .next()
      .remove("label");
  }

  // ISSUE SECTION
  addIssue() {
    this.hideErrors();

    // create form data instance
    const formData = new FormData();

    // append other fields
    formData.append("data", JSON.stringify(this.issuesData));

    // this.apiService.postData('issues/', data).subscribe({
    this.apiService.postData("issues", formData, true).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.clearIssueData();
        this.toastr.success("Issue Added successfully");
        this.listService.separateModals("");
        let issueVehicleID = localStorage.getItem("issueVehicleID");
        issueVehicleID = issueVehicleID.slice(1, -1);
        this.listService.fetchVehicleIssues(issueVehicleID);
        this.listService.fetchAssetsIssues(issueVehicleID);
      },
    });
  }

  issuesUnitType(value: string) {
    this.issuesData.unitID = "";
    this.issuesData.unitType = value;
  }

  clearIssueData() {
    this.issuesData = {
      issueName: "",
      currentStatus: "OPEN",
      unitID: "",
      unitType: "vehicle",
      reportedDate: "",
      description: "",
      odometer: null,
      reportedBy: "",
      assignedTo: "",
    };
  }

  fetchUsers() {
    if (this.users.length === 0) {
      this.apiService.getData("common/users").subscribe((result: any) => {
        result["Items"].map((r: any) => {
          if (r.isDeleted === 0) {
            this.users.push(r);
          }
        })

      });
    }
  }

  clearAssetMake() {
    this.assetMakeData.manufacturerName = "";
  }

  clearServiceProg() {
    this.serviceData.programName = "";
    this.serviceData.description = "";
    this.serviceData.serviceScheduleDetails = [
      {
        serviceTask: "",
        repeatByTime: "",
        repeatByTimeUnit: "",
        repeatByOdometer: "",
      },
    ];
    this.serviceData.vehicles = [];
  }

  clearServiceTask() {
    this.taskData = {
      taskType: "service",
      taskName: "",
      description: "",
    };
  }

  selectDocTypes(event) {
    let files = [];
    this.uploadedDocs = [];
    files = [...event.target.files];
    let totalCount = this.getDocsLength + files.length;

    if (totalCount > 10) {
      this.uploadedDocs = [];
      this.toastr.error("Only 10 documents can be uploaded");
      return false;
    } else {
      this.uploadedDocs = files;
    }
  }

  addDocTypes() {
    if (this.uploadedDocs.length === 0) {
      this.toastr.error("Please select at least one document!");
      return false;
    }
    //this.isDocSubmit = true;
    let obj = {
      docType: this.docs.docType,
      documents: this.uploadedDocs,
      module: ''
    }
    if (this.documentType === 'order') {
      obj.module = 'order';
    } else if (this.documentType === 'trip') {
      obj.module = 'trip';
    }
    this.listService.getAllDocs(obj);

  }
}