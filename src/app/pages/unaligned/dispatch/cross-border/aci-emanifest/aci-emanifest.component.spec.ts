import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AciEmanifestComponent } from './aci-emanifest.component';

describe('AciEmanifestComponent', () => {
  let component: AciEmanifestComponent;
  let fixture: ComponentFixture<AciEmanifestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AciEmanifestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AciEmanifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
