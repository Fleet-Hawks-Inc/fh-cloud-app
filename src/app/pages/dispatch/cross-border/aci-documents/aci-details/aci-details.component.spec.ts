import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AciDetailsComponent } from './aci-details.component';

describe('AciDetailsComponent', () => {
  let component: AciDetailsComponent;
  let fixture: ComponentFixture<AciDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AciDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AciDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
