import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-inspection-form",
  templateUrl: "./add-inspection-form.component.html",
  styleUrls: ["./add-inspection-form.component.css"],
})
export class AddInspectionFormComponent implements OnInit {
  title = "Add Inspection Forms";

  /********** Form Fields ***********/

  title = "";
  description = "";
  parameters = [
    {
      name: 'Air Lines'
    },
    {
      name: 'Battery'
    },
    {
      name: "Belts"
    }​,
    {
      name: 'Body/Doors'
    }​,
    {
      name: 'Brake Lines To Trailer'
    }​,
    {
      name: 'Brakes'
	  ​​}​,
    {
      name: 'Cab/Doors/Windows​'
	  ​ }​,
    {
      name: 'Clutch'
    }​,
    {
      name: 'Coolant Leak​'
	  ​}​,
    {
    name: 'Coolant Level'
	  }​,
    {
    name: 'Drive Line​'
	  }​,
    {
    name: 'Electric Lines To Trailer'
	  }​,
    {
    name: 'Emergency Brakes​'
	  }​,
    {
    name: 'Emergency Tire Chains'
    }​,
    {
    name: 'Exhaust'
    }​,
    {
    name: 'Fifth-wheel'
	  ​​}​,
    {
    name: 'Fire Extinguisher'
	  ​​}​,
    {
    name: 'Fuel Leak'
    }​,
    {
    name: 'Gauges/Warning Indicators​'
	  ​}​,
    {
    name: 'Grease Leak'
	  ​}​,
    {
    name: 'Horns​'
	  ​}​,
    {
    name: 'Light Line'
	  ​​}​,
    {
    name: 'Lights'
	  ​​},​
    {
    name: 'Mirrors​'
	  ​}​,
    {
    name: 'Oil Leak​'
	  ​}​,
    {
    name: 'Oil Level'
	  ​​}​,
    {
    name: 'Other Coupling​'
	  ​}​,
    {
    name: 'Other Safety Equipment​'
	  ​}​,
    {
    name: 'Parking Brake​'
	  }​,
    {
    name: 'Rear-End Protection​'
	  ​}​,
    {
    name: 'Reflectors'
	  ​}​,
    {
    name: 'Service Brakes'
	  ​​}​,
    {
    name: 'Spare Fuses​'
	  ​}​,
    {
    name: 'Steering'
	  ​​}​,
​​    {
    name: 'Suspension'
	  ​​}​,
    {
    name: 'Tie-Downs'
	  ​​}​,
    {
    name: 'Tractor Air Pressure Warning Device​'
	  ​}​,
    {
    name: 'Tractor Ammeter'
	  ​}​,
    {
    name: 'Tractor Body​'
	  ​}​,
    {
    name: 'Tractor Clearance Marker Lights​'
	  ​}​,
    {
    name: 'Tractor Cooling System'
	  ​}​,
    {
    name: 'Tractor Engine​'
	  ​}​,
    {
      name: 'Tractor Frame Assembly'
	  ​​}​,
    {
    name: 'Tractor Fuel System'
	  ​​}​,
    {
    name: 'Tractor Glass'
	  ​​}​,
    {
    name: 'Tractor Leaks'
	  ​​}​,
    {
    name: 'Tractor Oil Pressure​'
	  ​}​,
    {
    name: 'Tractor Other Items​'
	  ​}​,
    {
    name: 'Tractor Rear Vision Mirror​'
	  ​}​,
    {
    name: 'Tractor Speedometer'
	  ​}​,
    {
    name: 'Tractor Stop/Turn Lights'
	  ​​}​,
    {
    name: 'Tractor Tail Lights'
	  ​​}​,
    {
    name: 'Tractor Tires'
	  ​​}​,
    {
    name: 'Tractor Transmission​'
	  ​}​,
    {
    name: 'Triangles'
	  ​​}​,
    {
    name: 'Wheels/Rims/Lugs​'
	  ​}​,
    {
    name: 'Windshield Wipers/Washers'
	  ​}​,
    {
    name: 'Trailer Brake Connections'
	  ​​}​,
    {
    name: 'Trailer Brakes​'
	  ​}​,
    {
    name: 'Trailer Coupling King Pin'
	  }​,
    {
    name: 'Trailer Doors​'
    }​,
    {
    name: 'Trailer Hitch'
	  ​}​,
    {
    name: 'Trailer Landing Gear'
	  ​}​,
    {
    name: 'Trailer Lights'
	  ​}​,
    {
    name: 'Trailer Reflectors​'
    }​,
    {
    name: 'Trailer Roof​'
    }​,
    {
    name: 'Trailer Suspension System​'
    }​,
    {
    name: 'Trailer Tarpaulin​'
    }​,
    {
    name: 'Trailer Tires'
	  ​}​,
    {
    name: 'Trailer Wheels/Rims/Lugs'
	  ​}​,
    {
    name: 'Trailer Wheels/Rims/Lugs'
    }​
];
  /******************/

  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {}

  addInspectionForm() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      title: this.titlee,
      description: this.description,
    };

    this.apiService.postData("inspectionForms", data).subscribe({
      complete: () => {},
      error: (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Inspection Form Added successfully";
        this.titlee = "";
        this.description = "";
      },
    });
  }

  cloneInput() {
    this.parameters.push({
      name: ""
    });
  }

  deleteInput(i: number) {
    this.parameters.splice(i, 1);
  }
}
