import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettlementsDetailComponent } from './settlements-detail.component';

describe('SettlementsDetailComponent', () => {
  let component: SettlementsDetailComponent;
  let fixture: ComponentFixture<SettlementsDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
