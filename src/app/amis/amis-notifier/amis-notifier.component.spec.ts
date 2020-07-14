import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmisNotifierComponent } from './amis-notifier.component';

describe('AmisNotifierComponent', () => {
  let component: AmisNotifierComponent;
  let fixture: ComponentFixture<AmisNotifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmisNotifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmisNotifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
