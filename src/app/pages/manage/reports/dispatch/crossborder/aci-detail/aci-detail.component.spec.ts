import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AciDetailComponent } from './aci-detail.component';

describe('AciDetailComponent', () => {
  let component: AciDetailComponent;
  let fixture: ComponentFixture<AciDetailComponent>;

  beforeEach(async(() => {
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
