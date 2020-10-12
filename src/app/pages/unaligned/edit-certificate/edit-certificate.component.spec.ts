import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCertificateComponent } from './edit-certificate.component';

describe('EditCertificateComponent', () => {
  let component: EditCertificateComponent;
  let fixture: ComponentFixture<EditCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
