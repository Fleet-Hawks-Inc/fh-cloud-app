import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAccountComponent } from './add-account.component';

describe('AddAccountComponent', () => {
  let component: AddAccountComponent;
  let fixture: ComponentFixture<AddAccountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
