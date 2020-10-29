import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDocumentListComponent } from './my-document-list.component';

describe('MyDocumentListComponent', () => {
  let component: MyDocumentListComponent;
  let fixture: ComponentFixture<MyDocumentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDocumentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
