import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService } from "src/app/services";

@Component({
  selector: "app-bill-list",
  templateUrl: "./bill-list.component.html",
  styleUrls: ["./bill-list.component.css"],
})
export class BillListComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  payOrders = [];
  vendors = {};
  filter = {
    amount: null,
    startDate: null,
    endDate: null,
  };
  disableSearch = true;
  lastItemSK = "";
  loaded = false;

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}
}
