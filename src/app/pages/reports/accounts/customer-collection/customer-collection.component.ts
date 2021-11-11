import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service'
import { SelectionType, ColumnMode } from "@swimlane/ngx-datatable";
import Constant from "src/app/pages/fleet/constants";
@Component({
  selector: 'app-customer-collection',
  templateUrl: './customer-collection.component.html',
  styleUrls: ['./customer-collection.component.css']
})
export class CustomerCollectionComponent implements OnInit {
  @ViewChild('myTable') table: any;
  constructor(private apiService: ApiService, private el: ElementRef) { }
  public customerCollection = []
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  dataMessage = "";
  loaded = false;
  readonly rowHeight = 60;
  readonly headerHeight = 50;
  expanded: any = {};
  orders = []
  lastSK = ""
  isLoading = false
  pageLimit = 20
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
      const result = await this.apiService.getData('contacts/get/customer/collection').toPromise();

      this.dataMessage = Constant.FETCHING_DATA
      if (result.Items.length == 0) {
        this.dataMessage = Constant.NO_RECORDS_FOUND
      }
      if (result.Items.length > 0) {
        this.isLoading = false;
        if (result.LastEvaluatedKey !== undefined) {
          this.lastSK = encodeURIComponent(result.LastEvaluatedKey)
        }
        else {
          this.lastSK = "end"
        }
        this.customerCollection = this.customerCollection.concat(result.Items)
      }
    }
  }
  async onDetailToggle(event) {
    // this.orders = []
    // let result = await this.apiService.getData(`contacts/get/customer/orders/${event.value.contactID}`).toPromise();
    // this.orders = result.Items

  }
  toggleExpandRow(row, expanded) {


    this.table.rowDetail.toggleExpandRow(row);
  }

}
