import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUnlockComponent } from './dialog-unlock.component';

describe('DialogUnlockComponent', () => {
  let component: DialogUnlockComponent;
  let fixture: ComponentFixture<DialogUnlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUnlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
