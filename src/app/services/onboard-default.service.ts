import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class OnboardDefaultService {
  

  constructor(private apiService: ApiService,private toaster:ToastrService) { }

  async checkInspectionForms(){
    let formData;
   formData = await this.apiService.getData('inspectionForms').toPromise()
    if (formData.Count == 0){
      let govtApprovedForms= await this.getDefaultInspectionForm();
      console.log(govtApprovedForms.Count)
      if(govtApprovedForms.Count>0){
        govtApprovedForms.Items.forEach(element => {
          delete element.isGovtApproved
          this.apiService.postData('inspectionForms',element).subscribe({
            complete: () => { },
            next: (res) => {
              this.toaster.success('Default Forms Created successfully');
            }
          });  
        });
      }
      }
}
private async getDefaultInspectionForm(){
  return await this.apiService.getData('inspectionForms/get/govDefault').toPromise();
}

}


// GetIspectionForms by carrier ID 
// If count is 0 
// Get Default inspection forms for Vehicle and Carrier
// Create Input and invoke POST call to create inspection for each of them
