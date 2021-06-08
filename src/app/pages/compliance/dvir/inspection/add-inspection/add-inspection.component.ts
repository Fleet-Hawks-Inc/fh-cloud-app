import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import {  map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from 'ng2-charts';

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

  selectedInspectionType:any;
  defaultInspectionForms:any;
  vehicleParameters:any
  assetParameters:any
  inspectionFormID:any;
  pageTitle:any;

  ngOnInit() {
    this.inspectionFormID=this.route.snapshot.params['inspectionID']
    if(this.inspectionFormID!=undefined){
      this.pageTitle='Edit Inspection Form'
      this.fetchCurrentForm();
    }
    else{
      this.pageTitle='Add Inspection Form'
      this.fetchDefaultInspectionForm();
    }
  }

  fetchCurrentForm(){
      this.apiService
        .getData(`inspectionForms/${this.inspectionFormID}`)
        .subscribe((result) => {
          let inspectionForm:any=result.Items[0]
          this.inspectionFormName=inspectionForm.inspectionFormName;
          this.inspectionType=inspectionForm.inspectionType;
          this.parameters=inspectionForm.parameters;
          this.isDefaultInspectionType=inspectionForm.isDefaultInspectionType
        });
  }
  fetchDefaultInspectionForm(){
    this.apiService.getData('inspectionForms/get/defaultInspecitonForm').subscribe((res)=>{
      if(res.Count>0){
 
        let form=res.Items
        form.forEach(element => {
          if(element.inspectionType=="vehicle"){
            this.vehicleParameters=element.parameters
          }
          else{
            this.assetParameters=element.parameters
          }
          
        });
      }
     })

  }

  getInspectionForms(event){
    this.selectedInspectionType=event
    if(event=="vehicle"){
    this.parameters=this.vehicleParameters
    }
    else{
      this.parameters=this.assetParameters
    }
  }

  updateInspectionForm(){
    if(!this.hasError){
      let parameters=this.parameters.filter(value=>value.name!='')
    const data={
      inspectionFormName: this.inspectionFormName,
      inspectionType: this.inspectionType,
      isDefaultInspectionType: this.isDefaultInspectionType,
      parameters:parameters,
      inspectionFormID:this.inspectionFormID
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
              // this.throwErrors();
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
  else{
    this.toaster.error(this.Error)
  }
  }
  addInspectionForm(){
    if(!this.hasError){
    if(this.isDefaultInspectionType==1){
      this.parameters.map((param)=>{
        param.isDefault=true
      }) 
    }
    let parameters=this.parameters.filter(value=>value.name!='')
    const data={
      inspectionFormName: this.inspectionFormName,
      inspectionType: this.inspectionType,
      isDefaultInspectionType: this.isDefaultInspectionType,
      parameters:parameters
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
              // this.throwErrors();
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
  else{
    this.toaster.error(this.Error)
  }
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
    if(this.parameters[index].name != '') {
      this.hasError=false;
      this.parameters.push({
        name:'',
        isDefault:false
      })
    } else {
      this.toaster.error("Parameter can not be empty")
      this.Error="Parameter can not be empty";
      this.hasError=true;
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
