import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AceDetailComponent } from './ace-detail.component';

describe('AceDetailComponent', () => {
  let component: AceDetailComponent;
  let fixture: ComponentFixture<AceDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
