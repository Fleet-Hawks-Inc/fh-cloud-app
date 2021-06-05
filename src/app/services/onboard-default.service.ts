import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OnboardDefaultService {


  constructor(private apiService: ApiService, private toaster: ToastrService, private httpClient: HttpClient) { }
  govtApprovedForms:any = [];

  async checkInspectionForms() {
    let formData;
    
    formData = await this.apiService.getData('inspectionForms').toPromise()
    if (formData.Count == 0) {
      await this.getDefaultInspectionForm();
      if (this.govtApprovedForms.length > 0) {
        this.govtApprovedForms.forEach(element => {
          this.apiService.postData('inspectionForms', element).subscribe({
            complete: () => { },
            next: (res) => {
              // this.toaster.success('Default Forms Created successfully');
            }
          });
        });
      }
    }
  }
  private async getDefaultInspectionForm() {
    this.httpClient.get('assets/jsonFiles/inspectionForm/defaultForm.json').subscribe((data: any) => {
      this.govtApprovedForms = data;
    })
  }

}


// GetIspectionForms by carrier ID 
// If count is 0 
// Get Default inspection forms for Vehicle and Carrier
// Create Input and invoke POST call to create inspection for each of them
