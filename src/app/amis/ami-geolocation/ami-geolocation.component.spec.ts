import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmiGeolocationComponent } from './ami-geolocation.component';

describe('AmiGeolocationComponent', () => {
  let component: AmiGeolocationComponent;
  let fixture: ComponentFixture<AmiGeolocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmiGeolocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmiGeolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
