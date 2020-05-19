import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: "app-service-program-list",
  templateUrl: "./service-program-list.component.html",
  styleUrls: ["./service-program-list.component.css"],
})
export class ServiceProgramListComponent implements OnInit {
  title = "Service Program List";
  programs;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchPrograms();
  }

  fetchPrograms() {
    this.apiService.getData("servicePrograms").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.programs = result.Items;
      },
    });
  }

  deleteProgram(programId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable("#datatable-default")) {
      $("#datatable-default").DataTable().clear().destroy();
    }
    /******************************/

    this.apiService
      .deleteData("servicePrograms/" + programId)
      .subscribe((result: any) => {
        this.fetchPrograms();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}
