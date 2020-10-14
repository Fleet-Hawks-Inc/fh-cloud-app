import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceManifestComponent } from './ace-manifest.component';

describe('AceManifestComponent', () => {
  let component: AceManifestComponent;
  let fixture: ComponentFixture<AceManifestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceManifestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
