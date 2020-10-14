import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocumentsComponent } from './add-documents.component';

describe('AddDocumentsComponent', () => {
  let component: AddDocumentsComponent;
  let fixture: ComponentFixture<AddDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
