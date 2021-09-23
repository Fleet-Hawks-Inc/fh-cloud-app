import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettlementsListComponent } from './settlements-list.component';

describe('SettlementsListComponent', () => {
  let component: SettlementsListComponent;
  let fixture: ComponentFixture<SettlementsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
