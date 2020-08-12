import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGeolocationComponent } from './dialog-geolocation.component';

describe('DialogGeolocationComponent', () => {
  let component: DialogGeolocationComponent;
  let fixture: ComponentFixture<DialogGeolocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogGeolocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGeolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
