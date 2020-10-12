import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-r-forms',
  templateUrl: './r-forms.component.html',
  styleUrls: ['./r-forms.component.css']
})
export class RFormsComponent implements OnInit {

  buttonStatus = '';
  formArray = [];
  fname = new FormControl('test');
  profileForm = new FormGroup({
    firstname: new FormControl(),
  lastname: new FormControl()
  });

  profileFormb = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    address: this.fb.group({
      streetAddress: ['']
    })
  });


  dynamicForms: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
  private fb: FormBuilder) { }

  fbcheck() {
    if(this.profileFormb.status === 'VALID') {
      this.buttonStatus = 'button test';
    }
  }

  // get aliases() {
  //  this.formArray.push(this.profileFormb.get('aliases') as FormArray);
  // }

  ngOnInit() {
    // this.profileForm.setValue({firstname: 'test2',
    //   lastname: 'test3'});
  }

}
