import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetGeolocationComponent } from './trajet-geolocation.component';

describe('TrajetGeolocationComponent', () => {
  let component: TrajetGeolocationComponent;
  let fixture: ComponentFixture<TrajetGeolocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetGeolocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetGeolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
