import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../services';
@Component({
  selector: 'app-add-load-invoice',
  templateUrl: './add-load-invoice.component.html',
  styleUrls: ['./add-load-invoice.component.css']
})
export class AddLoadInvoiceComponent implements OnInit {

  constructor(private accountService: AccountService) { }
 txnDate: string;
 invNumber: string;
 invType: string;
 orderNumber: string;
 customerID: string;
 accessFeesInfo = {
  accessFees: [
    {
      type: '',
      amount: 0,
      currency: '',
    },
  ],
};

accessorialDeductionInfo = {
  accessDeductions: [
    {
      type: '',
      amount: 0,
      currency: '',
    },
  ],
};
  shipment = [
    {
      shippers: {
        shipperID: null,
        pickUp: [{
        pickupLocation: '',
        pickupDate: '',
        pickupTime: '',
        pickupInstruction: '',
        contactPerson: '',
        phone: '',
        reference: '',
        notes: '',
        commodity: [
          {
            name: '',
            quantity: '',
            quantityUnit: null,
            weight: '',
            weightUnit: null,
            pu: ''
          },
        ]}
      ]
      },
      receivers: {
        receiverID: null,
        dropOff: [{
          dropOffLocation: '',
          dropOffDate: '',
          dropOffTime: '',
          dropOffInstruction: '',
          contactPerson: '',
          phone: '',
          reference: '',
          notes: '',
          commodity: [
            {
              name: '',
              quantity: '',
              quantityUnit: null,
              weight: '',
              weightUnit: null,
              del: ''
            },
          ]
        }]
      },
    }
  ];
  charges: {
    freightFee: {
      type: null,
      amount: 0,
      currency: null,
    },
    fuelSurcharge: {
      type: null,
      amount: 0,
      currency: null,
    },
    accessorialFeeInfo: {
      accessorialFee: [],
    },
    accessorialDeductionInfo: {
      accessorialDeduction: [],
    },
  }
  ngOnInit() {
    this.fetchInvoices();
    this.fetchInvoice();
  }
 addLoadInvoice() {
   const data = {
    txnDate: '09/09/2021',
    invNumber: '999999999999999',
    invType: 'orderInvoice',
    orderNumber: '678768',
    customerID: '867487',
    notes: 'test notes',
    shipment: [
      {
        shippers: {
          shipperID: '1111',
          pickUp: [{
          pickupLocation: 'pickuplocation',
          pickupDate: '2021',
          pickupTime: '2021',
          pickupInstruction: 'pickupInstruction',
          contactPerson: 'contactPerson',
          phone: '8856456747',
          reference: '67575758',
          notes: 'notes',
          commodity: [
            {
              name: 'cakes',
              quantity: '10',
              quantityUnit: 'box',
              weight: '16',
              weightUnit: 'lb',
              pu: '567578'
            },
          ]}
        ]
        },
        receivers: {
          receiverID: '856756',
          dropOff: [{
            dropOffLocation: 'dropOffLocation',
            dropOffDate: 'dropOffDate',
            dropOffTime: 'dropOffTime',
            dropOffInstruction: 'dropOffInstruction',
            contactPerson: 'contactPerson',
            phone: 'phone',
            reference: 'reference',
            notes: 'notes',
            commodity: [
              {
                name: 'cakes',
                quantity: '10',
                quantityUnit: 'box',
                weight: '16',
                weightUnit: 'lb',
                del: '756868'
              },
            ]
          }]
        },
      }
    ],
    charges: {
      freightFee: {
        type: 'permile',
        amount: 140,
        currency: 'CAD',
      },
      fuelSurcharge: {
        type: 'permile',
        amount: 786,
        currency: 'CAD',
      },
      accessorialFeeInfo: {
        accessFees: [
          {
            type: 'test',
            amount: 10,
            currency: 'CAD',
          },
        ],
      },
      accessorialDeductionInfo: {
        accessDeductions: [
          {
            type: 'testdeduct',
            amount: 10,
            currency: 'CAD',
          },
        ],
      },
    },
    totalAmount: 1200,
    taxAmount: 100,
    transactionLog : []
   };
   const invID = '1vD7jJpv2eKTgW0IanO9PRBPGR6';
   this.accountService.deleteData(`order-invoice/delete/${invID}`).subscribe((res: any) => {
   });
 }

 fetchInvoices() {
  this.accountService.getData('order-invoice').subscribe((res: any) => {
  });
 }

 fetchInvoice() {
   const invID = '1vD7jJpv2eKTgW0IanO9PRBPGR6';
   this.accountService.getData(`order-invoice/${invID}`).subscribe((res: any) => {
   });
 }
}
