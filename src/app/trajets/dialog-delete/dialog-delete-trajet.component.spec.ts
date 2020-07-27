import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteTrajetComponent } from './dialog-delete-trajet.component';

describe('DialogDeleteTrajetComponent', () => {
  let component: DialogDeleteTrajetComponent;
  let fixture: ComponentFixture<DialogDeleteTrajetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogDeleteTrajetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteTrajetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
