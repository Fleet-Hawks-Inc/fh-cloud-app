import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RouteManagementServiceService {
  public orderUpdateSessionID: string;
  public tripUpdateSessionID: string;
  public driverUpdateSessionID: string;
  public vehicleUpdateSessionID: string;
  public assetUpdateSessionID: string;
  public fuelUpdateSessionID: string;
  public maintainanceSessionID: string;
  public serviceLogSessionID: string;
  public chartAccountSessionID: string;
  public serviceRemindersSessionID: string;
  public inventorySessionID: string;
  public deviceSessionID: string;
  public userSessionID: string;
  public IncomeTransactionsSessionID: string;
  public ExpenseTransactionsSessionID: string;
  public ManualJournalSessionID: string;
  public ReceiptsSessionID: string;
  public fuelTransactionSessionID: string;
  public salesOrderSessionID: string;
  public salesInvoiceSessionID: string;
  public creditNoteSessionID: string;
  constructor() {
    this.orderUpdateSessionID = uuidv4();
    this.tripUpdateSessionID = uuidv4();
    this.driverUpdateSessionID = uuidv4();
    this.vehicleUpdateSessionID = uuidv4();
    this.assetUpdateSessionID = uuidv4();
    this.fuelUpdateSessionID = uuidv4();
    this.maintainanceSessionID = uuidv4();
    this.serviceLogSessionID = uuidv4();
    this.chartAccountSessionID = uuidv4();
    this.serviceRemindersSessionID = uuidv4();
    this.inventorySessionID = uuidv4();
    this.deviceSessionID = uuidv4();
    this.userSessionID = uuidv4();
    this.IncomeTransactionsSessionID = uuidv4();
    this.ExpenseTransactionsSessionID = uuidv4();
    this.ManualJournalSessionID = uuidv4();
    this.ReceiptsSessionID = uuidv4();
    this.fuelTransactionSessionID = uuidv4();
    this.salesOrderSessionID = uuidv4();
    this.salesInvoiceSessionID =uuidv4();
    this.creditNoteSessionID =uuidv4();
  }

  driverUpdated() {
    return this.driverUpdateSessionID = uuidv4();
  }

  orderUpdated() {
    return this.orderUpdateSessionID = uuidv4();
  }

  tripUpdated() {
    return this.tripUpdateSessionID = uuidv4();
  }
  vehicleUpdated() {
    return this.vehicleUpdateSessionID = uuidv4();
  }
  assetUpdated() {
    return this.assetUpdateSessionID = uuidv4();
  }
  fuelUpdated() {
    return this.fuelUpdateSessionID = uuidv4();
  }

  maintainanceUpdated() {
    return this.maintainanceSessionID = uuidv4();
  }

  serviceLogUpdated() {
    return this.serviceLogSessionID = uuidv4();
  }

  chartAccountUpdate() {
    return this.chartAccountSessionID = uuidv4();
  }

  serviceReminderUpdated() {
    return this.serviceRemindersSessionID = uuidv4();
  }

  inventoryUpdated() {
    return this.inventorySessionID = uuidv4();
  }

  deviceUpdated() {
    return this.deviceSessionID = uuidv4();
  }

  userUpdated() {
    return this.userSessionID = uuidv4();
  }

  IncomeTransactionUpdate() {
    return this.IncomeTransactionsSessionID = uuidv4();
  }

  ExpenseTransactionsUpdate() {
    return this.ExpenseTransactionsSessionID = uuidv4();
  }

  ManualJournalSessionIDUpdate() {
    return this.ManualJournalSessionID = uuidv4();
  }

  ReceiptsSessionIDUpdate() {
    return this.ReceiptsSessionID = uuidv4();
  }

  fuelTransactionUpdate() {
    return this.fuelTransactionSessionID = uuidv4();
  }

  salesOrderUpdate() {
    return this.salesOrderSessionID = uuidv4();
  }

  salesInvoiceUpdate() {
    return this.salesInvoiceSessionID = uuidv4();
  }

  creditNoteUpdate() {
    return this.creditNoteSessionID = uuidv4();
  }


  resetAllCache() {
    this.tripUpdateSessionID = uuidv4();
    this.orderUpdateSessionID = uuidv4();
    this.driverUpdateSessionID = uuidv4();
    this.vehicleUpdateSessionID = uuidv4();
    this.assetUpdateSessionID = uuidv4();
    this.fuelUpdateSessionID = uuidv4();
    this.maintainanceSessionID = uuidv4();
    this.serviceLogSessionID = uuidv4();
    this.chartAccountSessionID = uuidv4();
    this.serviceRemindersSessionID = uuidv4();
    this.inventorySessionID = uuidv4();
    this.deviceSessionID = uuidv4();
    this.userSessionID = uuidv4();
    this.IncomeTransactionsSessionID = uuidv4();
    this.ExpenseTransactionsSessionID = uuidv4();
    this.ManualJournalSessionID = uuidv4();
    this.ReceiptsSessionID = uuidv4();
    this.fuelTransactionSessionID = uuidv4();
    this.salesOrderSessionID = uuidv4();
    this.salesInvoiceSessionID =uuidv4();
    this.creditNoteSessionID =uuidv4();
  }
}