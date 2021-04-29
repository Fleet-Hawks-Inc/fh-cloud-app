import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import {  map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-add-inspection',
  templateUrl: './add-inspection.component.html',
  styleUrls: ['./add-inspection.component.css']
})
export class AddInspectionComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private route:ActivatedRoute,
    private location: Location,
    private toaster: ToastrService,) { }

  inspectionFormName:string ='';
  inspectionType:string = '';
  isDefaultInspectionType:Number=0
  parameters=[{
    name:'',
    isDefault:false
  }]
  formID:any;
  response:any='';
  errors={};
  defaultParameterCount:number=0; 
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';


  ngOnInit() {
    this.formID=this.route.snapshot.params['formID']
    this.apiService.getData('inspectionForms/get/defaultInspecitonForm').subscribe((res)=>{
      if(res.Items[0])
       this.parameters=res.Items[0].parameters
       this.defaultParameterCount=this.parameters.length;
    })
  }

  addInspectionForm(){
    if(this.isDefaultInspectionType==1){
      this.parameters.map((param)=>{
        param.isDefault=true
      }) 
    }
    const data={
      inspectionFormName: this.inspectionFormName,
      inspectionType: this.inspectionType,
      isDefaultInspectionType: this.isDefaultInspectionType,
      parameters:this.parameters
    }
    
    this.apiService.postData('inspectionForms',data).subscribe({
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
        this.toaster.success('Form Created successfully');
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
  addFormParam(index){
    if(this.parameters[index].name !== '') {
      this.parameters.push({
        name:'',
        isDefault:false
      })
    } else {
      return false;
    }
  }

  deleteFormParam(t){
    this.parameters.splice(t,1)
  }

  defaultCheckbox(event){
  this.isDefaultInspectionType =event.target.checked? 1: 0

  }

  // updateInspectionForm(){
  //   this.hasError=false;
  //   this.hasSuccess=false;
  //   this.hideErrors();
  
  //     const data={
  //       inspectionFormName: this.inspectionFormName,
  //       inspectionType: this.inspectionType,
  //       isDefaultInspectionType: this.isDefaultInspectionType,
  //       parameters:this.parameters
  //     }
      
  //     this.apiService.putData('inspectionForms',data).subscribe({
  //       complete: () => { },
  //       error: (err: any) => {
  //         from(err.error)
  //           .pipe(
  //             map((val: any) => {
  //               val.message = val.message.replace(/".*"/, 'This Field');
  //               this.errors[val.context.key] = val.message;
  //             })
  //           )
  //           .subscribe({
  //             complete: () => {
  //               this.throwErrors();
  //             },
  //             error: () => { },
  //             next: () => { },
  //           });
  //       },
  //       next: (res) => {
  //         this.response = res;
  //         this.toaster.success('Form Updated successfully');
  //         this.cancel();
  //       }
  //     });
  //   }
    


  // hideErrors() {
  //   from(Object.keys(this.errors)).subscribe((v) => {
  //     $('[name="' + v + '"]')
  //       .removeClass('error')
  //       .next()
  //       .remove('label');
  //   });
  //   this.errors = {};
  // }
}
