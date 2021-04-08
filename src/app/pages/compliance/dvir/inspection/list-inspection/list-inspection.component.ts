import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-list-inspection',
  templateUrl: './list-inspection.component.html',
  styleUrls: ['./list-inspection.component.css']
})
export class ListInspectionComponent implements OnInit {
public inspectionForms: any;
  constructor(private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }
  

  ngOnInit() {
    this.fetchInspectionForms();
  }
  fetchInspectionForms = () => {
    this.spinner.show()
    this.apiService.getData('inspectionForms').subscribe({
      complete: () => {
      },
      error: () => {},
      next: (result: any) => {
        console.log(result)
        this.inspectionForms = result.Items;
      },
    });
    this.spinner.hide();
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
