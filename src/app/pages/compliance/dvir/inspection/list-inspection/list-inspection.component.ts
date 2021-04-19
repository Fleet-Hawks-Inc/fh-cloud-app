import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-list-inspection',
  templateUrl: './list-inspection.component.html',
  styleUrls: ['./list-inspection.component.css']
})
export class ListInspectionComponent implements OnInit {
public inspectionForms: any=[];
  constructor(private apiService: ApiService,
    private toastr: ToastrService,) { }
  

  ngOnInit() {
    this.fetchGovForms();
    this.fetchInspectionForms();
  }

  fetchGovForms(){
    
    this.apiService.getData('inspectionForms/get/govDefault').subscribe({
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
