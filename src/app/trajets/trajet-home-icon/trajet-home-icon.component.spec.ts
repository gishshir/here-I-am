import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetHomeIconComponent } from './trajet-home-icon.component';

describe('TrajetHomeIconComponent', () => {
  let component: TrajetHomeIconComponent;
  let fixture: ComponentFixture<TrajetHomeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrajetHomeIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetHomeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
