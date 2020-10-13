import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: "app-entries",
  templateUrl: "./entries.component.html",
  styleUrls: ["./entries.component.css"],
})
export class EntriesComponent implements OnInit {
  title = "Stock Entry List";
  entries;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchEntries();
  }

  fetchEntries() {
    this.apiService.getData("stockEntries").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.entries = result.Items;
      },
    });
  }

  deleteEntry(documentId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable("#datatable-default")) {
      $("#datatable-default").DataTable().clear().destroy();
    }
    /******************************/
    this.apiService
      .deleteData("StockEntries/" + documentId)
      .subscribe((result: any) => {
        this.fetchEntries();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}
