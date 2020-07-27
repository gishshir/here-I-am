import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmInvitationComponent } from './dialog-confirm-invitation.component';

describe('DialogConfirmInvitationComponent', () => {
  let component: DialogConfirmInvitationComponent;
  let fixture: ComponentFixture<DialogConfirmInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogConfirmInvitationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
