import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAciManifestComponent } from './new-aci-manifest.component';

describe('NewAciManifestComponent', () => {
  let component: NewAciManifestComponent;
  let fixture: ComponentFixture<NewAciManifestComponent>;

  beforeEach(async(() => {
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
