import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedAssetsComponent } from './deleted-assets.component';

describe('DeletedAssetsComponent', () => {
  let component: DeletedAssetsComponent;
  let fixture: ComponentFixture<DeletedAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
