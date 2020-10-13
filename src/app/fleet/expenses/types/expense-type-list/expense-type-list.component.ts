import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: "app-expense-type-list",
  templateUrl: "./expense-type-list.component.html",
  styleUrls: ["./expense-type-list.component.css"],
})
export class ExpenseTypeListComponent implements OnInit {
  title = "Type List";
  expenseTypes;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchExpenseTypes();
  }

  fetchExpenseTypes() {
    this.apiService.getData("expenseTypes").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.expenseTypes = result.Items;
      },
    });
  }

  deleteExpenseType(expenseTypeId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable("#datatable-default")) {
      $("#datatable-default").DataTable().clear().destroy();
    }
    /******************************/

    this.apiService
      .deleteData("expenseTypes/" + expenseTypeId)
      .subscribe((result: any) => {
        this.fetchExpenseTypes();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}
