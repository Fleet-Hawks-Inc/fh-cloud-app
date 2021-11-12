import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service'
import { SelectionType, ColumnMode } from "@swimlane/ngx-datatable";
import Constant from "src/app/pages/fleet/constants";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-customer-collection',
  templateUrl: './customer-collection.component.html',
  styleUrls: ['./customer-collection.component.css']
})
export class CustomerCollectionComponent implements OnInit {
  @ViewChild('myTable') table: any;
  constructor(private apiService: ApiService, private el: ElementRef, private toastr: ToastrService) { }
  public customerCollection = []
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  dataMessage = "";
  loaded = false;
  readonly rowHeight = 70;
  readonly headerHeight = 70;
  expanded: any = {};
  orders = []
  lastSK = ""
  isLoading = false
  pageLimit = 10
  customer = ""
  customerFiltr = {
    startDate: '',
    endDate: ''
  }
  date = new Date();
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };

  ngOnInit(): void {
    this.fetchCustomerCollection();
  }
  onScroll(offsetY: any) {
    const viewHeight =
      this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;

    if (
      !this.isLoading &&
      offsetY + viewHeight + this.customerCollection.length * this.rowHeight
    ) {
      let limit = this.pageLimit;
      if (this.customerCollection.length === 0) {
        const pageSize = Math.ceil(viewHeight / this.rowHeight);

        limit = Math.max(pageSize, this.pageLimit);
      }
      if (this.loaded) {
        this.fetchCustomerCollection();
      }
      this.loaded = false;
    }
  }

  async fetchCustomerCollection(refresh?: boolean) {
    this.dataMessage = Constant.FETCHING_DATA
    this.isLoading = true;
    if (refresh === true) {
      this.lastSK = ""
      this.customerCollection = []
    }
    if (this.lastSK != 'end') {
      const result = await this.apiService.getData(`contacts/get/customer/collection?lastKey=${this.lastSK}`).toPromise();

      this.dataMessage = Constant.FETCHING_DATA
      if (result.Items.length == 0) {
        this.dataMessage = Constant.NO_RECORDS_FOUND
      }
      if (result.Items.length > 0) {
        this.isLoading = false;
        // console.log(result)
        if (result.LastEvaluatedKey.contactSK !== undefined) {
          this.lastSK = encodeURIComponent(result.LastEvaluatedKey.contactSK)
          this.loaded = true
        }
        else {
          this.lastSK = "end"
        }
        // console.log(this.lastSK)
        this.customerCollection = this.customerCollection.concat(result.Items)
      }
    }
  }
  async onDetailToggle(event) {

  }
  toggleExpandRow(row, expanded) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  async search() {
    if (!this.customer && !this.customerFiltr.startDate && !this.customerFiltr.endDate) {
      this.toastr.error("At least one field required")
    }
    else if (this.customerFiltr.startDate && !this.customerFiltr.endDate) {
      this.toastr.error("End Date is required")
    }
    else if (this.customerFiltr.endDate && !this.customerFiltr.startDate) {
      this.toastr.error("Start Date is required")
    }
    else if (this.customerFiltr.startDate > this.customerFiltr.endDate) {
      this.toastr.error("Start date can not exceeds End Date")
    }
    else {
      this.loaded = false
      this.customerCollection = []
      this.dataMessage = Constant.FETCHING_DATA
      const result: any = await this.apiService.getData(`contacts/get/customer/collection?customer=${this.customer}&start=${this.customerFiltr.startDate}&end=${this.customerFiltr.endDate}`).toPromise();

      if (result) {
        if (result.Items.length > 0) {
          this.customerCollection = result.Items
        }
        else {
          this.dataMessage = Constant.NO_RECORDS_FOUND
        }
      }
    }
  }

  reset() {
    this.lastSK = ''
    this.customer = ''
    this.customerFiltr.startDate = ''
    this.customerFiltr.endDate = ''
    this.customerCollection = []
    this.fetchCustomerCollection();

  }
  generateCSV() {

  }


}
