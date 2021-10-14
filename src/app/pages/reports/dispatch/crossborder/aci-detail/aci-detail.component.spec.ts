import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AciDetailComponent } from './aci-detail.component';

describe('AciDetailComponent', () => {
  let component: AciDetailComponent;
  let fixture: ComponentFixture<AciDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AciDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AciDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
