import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewAciManifestComponent } from './new-aci-manifest.component';

describe('NewAciManifestComponent', () => {
  let component: NewAciManifestComponent;
  let fixture: ComponentFixture<NewAciManifestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAciManifestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAciManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
