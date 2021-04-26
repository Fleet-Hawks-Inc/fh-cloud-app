import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import {OnboardDefaultService} from '../../../../../services/onboard-default.service'


@Component({
  selector: 'app-list-inspection',
  templateUrl: './list-inspection.component.html',
  styleUrls: ['./list-inspection.component.css']
})
export class ListInspectionComponent implements OnInit {
public inspectionForms: any=[];
  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private onboard:OnboardDefaultService) { }
  

  ngOnInit() {
    this.onboard.checkInspectionForms();
    
    this.fetchInspectionForms();
  }
  fetchInspectionForms = () => {
    
    this.apiService.getData('inspectionForms').subscribe({
      complete: () => {
      },
      error: () => {},
      next: (result: any) => {
        result.Items.forEach(element => {
          this.inspectionForms.push(element);
          
        });
      },
    });
  }

  deleteForm(id){
    if(confirm('Are you sure you want to delete')){
      this.apiService.deleteData('inspectionForms/'+id).subscribe((result)=>{
        if(result){
          this.fetchInspectionForms()
          this.toastr.success("Issue Deleted Successfully")
        }
      })
    }
  }

}
