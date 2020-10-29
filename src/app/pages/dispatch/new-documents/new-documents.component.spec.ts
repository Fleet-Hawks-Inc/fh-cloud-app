import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDocumentsComponent } from './new-documents.component';

describe('NewDocumentsComponent', () => {
  let component: NewDocumentsComponent;
  let fixture: ComponentFixture<NewDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
