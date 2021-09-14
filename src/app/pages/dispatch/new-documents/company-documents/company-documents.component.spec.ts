import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyDocumentsComponent } from './company-documents.component';

describe('CompanyDocumentsComponent', () => {
  let component: CompanyDocumentsComponent;
  let fixture: ComponentFixture<CompanyDocumentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
