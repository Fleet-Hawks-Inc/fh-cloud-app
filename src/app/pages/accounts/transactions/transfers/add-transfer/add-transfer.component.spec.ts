import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransferComponent } from './add-transfer.component';

describe('AddTransferComponent', () => {
  let component: AddTransferComponent;
  let fixture: ComponentFixture<AddTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
