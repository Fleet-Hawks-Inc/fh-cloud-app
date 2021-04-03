import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import {  map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-edit-inspection',
  templateUrl: './edit-inspection.component.html',
  styleUrls: ['./edit-inspection.component.css']
})
export class EditInspectionComponent implements OnInit {

  constructor(private apiService: ApiService,
    private location: Location,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    ) { }

  inspectionFormName:string ='';
  inspectionType:string = '';
  isDefaultInspectionType:Number=0
  parameters=[{
    name:'',
    isDefault:false
  }]

  response:any='';
  errors={};
  defaultParameterCount:number=0;
  formInspectionID:string;


  ngOnInit() {
    this.formInspectionID=this.route.snapshot.params["inspectionID"]
    this.spinner.show();
    this.apiService.getData('inspectionForms/'+this.formInspectionID)
    .subscribe((result)=>{
      result=result.Items[0];
      this.inspectionFormName=result.inspectionFormName;
      this.inspectionType=result.inspectionType;
      this.parameters=result.parameters;
      this.isDefaultInspectionType=result.isDefaultInspectionType
    })
this.spinner.hide();
    }
  updateInspectionForm(){
    const data={
      inspectionFormName: this.inspectionFormName,
      inspectionType: this.inspectionType,
      isDefaultInspectionType: this.isDefaultInspectionType,
      parameters:this.parameters
    }
    
    this.apiService.putData('inspectionForms',data).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.toaster.success('Form Updated successfully');
        this.cancel();
      }
    });
  }
  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
  }

  cancel(){
    this.location.back();
  }
  addFormParam(){
    
    this.parameters.push({
      name:'',
      isDefault:false
    })
  }

  deleteFormParam(t){
    this.parameters.splice(t,1)
  }
}
