import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteOldTrajetsComponent } from './dialog-delete-old.component';

describe('DialogDeleteOldComponent', () => {
  let component: DialogDeleteOldTrajetsComponent;
  let fixture: ComponentFixture<DialogDeleteOldTrajetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogDeleteOldTrajetsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteOldTrajetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
