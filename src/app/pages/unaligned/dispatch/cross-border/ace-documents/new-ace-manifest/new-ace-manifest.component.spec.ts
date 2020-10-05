import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAceManifestComponent } from './new-ace-manifest.component';

describe('NewAceManifestComponent', () => {
  let component: NewAceManifestComponent;
  let fixture: ComponentFixture<NewAceManifestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAceManifestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAceManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
