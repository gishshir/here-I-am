import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetDureeComponent } from './trajet-duree.component';

describe('TrajetDureeComponent', () => {
  let component: TrajetDureeComponent;
  let fixture: ComponentFixture<TrajetDureeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetDureeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetDureeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
