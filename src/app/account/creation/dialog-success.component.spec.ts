import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateAccountSuccessComponent } from './dialog-success.component';

describe('DialogSuccessComponent', () => {
  let component: DialogCreateAccountSuccessComponent;
  let fixture: ComponentFixture<DialogCreateAccountSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogCreateAccountSuccessComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateAccountSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
