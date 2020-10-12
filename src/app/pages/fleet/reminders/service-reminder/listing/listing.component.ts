import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  public remindersData = [];
  selectedAssets;
  isChecked = false;
  checkCount;
  selectedRemindersID;

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchReminders();
  }

  fetchReminders = () => {
    this.apiService.getData('serviceReminders').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.remindersData = result.Items;
        console.log(this.remindersData)
      },
    });
  }


  deleteAsset = () => {
    const selectedAssets = this.remindersData.filter(product => product.checked).map(p => p.remindersID);
    if (selectedAssets && selectedAssets.length > 0) {
      for (const i of selectedAssets) {
        this.apiService.deleteData('serviceReminders/' + i).subscribe((result: any) => {
          this.fetchReminders();
          this.toastr.success('Assets Deleted Successfully!');
        });
      }
    }
  }

  editAsset = () => {
    if (this.checkCount === 1) {
      this.router.navigateByUrl('/fleet/reminders/service-reminder/edit-reminder/' + this.selectedRemindersID);
    } else {
      this.toastr.error('Please select only one item!');
    }
  }

  // Count Checkboxes
  checkboxCount = () => {
    this.checkCount = 0;
    this.remindersData.forEach(item => {
      console.log(item.checked);
      if (item.checked) {
        this.selectedRemindersID = item.remindersID;
        this.checkCount = this.checkCount + 1;
      }
    });
  }

  checkuncheckall = () => {
    this.remindersData.forEach(item => {
      if (item.checked === true) {
        item.checked = false;
      } else {
        item.checked = true;
      }
    });
  }

}
