import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: "app-add-assets",
  templateUrl: "./add-assets.component.html",
  styleUrls: ["./add-assets.component.css"],
})
export class AddAssetsComponent implements OnInit {
  title = "Add Assets";

  /********** Form Fields ***********/
  assetName = "";
  VIN = "";
  assetType = "";
  year = "";
  assetInfo = {
    year: "",
    make: "",
    model: "",
  };
  length: "";
  axle = "";
  GVWR = "";
  GAWR = "";
  license = {
    state: "",
    plateNumber: "",
  };

  ownerShip = "";
  remarks = "";
  state = "";
  quantumInfo = {
    UID: "",
  };
  currentStatus = "";

  quantum = "";
  quantumsList = [];
  /******************/

  /**
   * Form errors prop
   */
  validationErrors = {
    assetName: {
      error: false,
    },
    VIN: {
      error: false,
    },
    assetType: {
      error: false,
    },
    assetInfo: {
      year: {
        error: false,
      },
      make: {
        error: false,
      },
      model: {
        error: false,
      },
    },
    length: {
      error: false,
    },
    axle: {
      error: false,
    },
    GVWR: {
      error: false,
    },
    GAWR: {
      error: false,
    },
    license: {
      state: {
        error: false,
      },
      plateNumber: {
        error: false,
      },
    },
    ownerShip: {
      error: false,
    },
    remarks: {
      error: false,
    },
    state: {
      error: false,
    },
    quantumInfo: {
      UID: {
        error: false,
      },
    },
    currentStatus: {
      error: false,
    },
  };

  manufacturers = [];
  states = [];
  models = []
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchQuantum();
    this.fetchManufactuer();
    this.fetchModel();
    this.fetchState();
  }

  fetchQuantum(){
    this.apiService.getData('quantums')
    .subscribe((result: any) => {
      this.quantumsList = result.Items;
    });
  }

  fetchManufactuer(){
    this.apiService.getData('manufacturers')
    .subscribe((result: any) => {
      this.manufacturers = result.Items;
    });
  }

  fetchModel(){
    this.apiService.getData('models')
    .subscribe((result: any) => {
      this.models = result.Items;
    });
  }

  fetchState(){
    this.apiService.getData('states')
    .subscribe((result: any) => {
      this.states = result.Items;
    });
  }

  quantumModal() {
    $(document).ready(function () {
      $("#modalAnim").modal("show");
    });
  }

  onChange(newValue) {
    this.quantum = newValue;
    this.quantumInfo.UID = newValue;
  }

  addAsset() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      assetName: this.assetName,
      VIN: this.VIN,
      assetType: this.assetType,
      assetInfo: {
        year: this.assetInfo.year,
        make: this.assetInfo.make,
        model: this.assetInfo.model,
      },
      length: this.length,
      axle: this.axle,
      GVWR: this.GVWR,
      GAWR: this.GAWR,
      license: {
        state: this.license.state,
        plateNumber: this.license.plateNumber,
      },
      ownerShip: this.ownerShip,
      remarks: this.remarks,
      state: this.state,
      quantumInfo: {
        UID: this.quantumInfo.UID,
      },
      currentStatus: this.currentStatus,
    };

    this.apiService.postData("assets", data).subscribe({
      complete: () => {},
      error: (err) => {
        this.mapErrors(err.error);
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Asset Added successfully";

        this.assetName = "";
        this.VIN = "";
        this.assetType = "";
        this.assetInfo.year = "";
        this.assetInfo.make = "";
        this.assetInfo.model = "";
        this.length = "";
        this.axle = "";
        this.GVWR = "";
        this.GAWR = "";
        this.license.state = "";
        this.license.plateNumber = "";
        this.ownerShip = "";
        this.remarks = "";
        this.state = "";
        this.quantumInfo.UID = "";
        this.currentStatus = "";
      },
    });
  }

  mapErrors(errors) {
    for (var i = 0; i < errors.length; i++) {
      let key = errors[i].path;
      let length = key.length;

      //make array of message to remove the fieldName
      let message = errors[i].message.split(" ");
      delete message[0];

      //new message
      let modifiedMessage = `This field${message.join(" ")}`;

      if (length == 1) {
        //single object
        this.validationErrors[key[0]].error = true;
        this.validationErrors[key[0]].message = errors[i].message;
      } else if (length == 2) {
        //two dimensional object
        this.validationErrors[key[0]][key[1]].error = true;
        this.validationErrors[key[0]][key[1]].message = errors[i].message;
      }
    }
    console.log(this.validationErrors);
  }

  updateValidation(first, second = "") {
    if (second == "") {
      this.validationErrors[first].error = false;
    } else {
      this.validationErrors[first][second].error = false;
    }
  }
}
