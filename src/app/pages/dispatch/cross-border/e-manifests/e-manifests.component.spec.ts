import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EManifestsComponent } from './e-manifests.component';

describe('EManifestsComponent', () => {
  let component: EManifestsComponent;
  let fixture: ComponentFixture<EManifestsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EManifestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EManifestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
