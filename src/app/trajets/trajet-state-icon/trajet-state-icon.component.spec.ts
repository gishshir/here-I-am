import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetStateIconComponent } from './trajet-state-icon.component';

describe('TrajetStateIconComponent', () => {
  let component: TrajetStateIconComponent;
  let fixture: ComponentFixture<TrajetStateIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetStateIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetStateIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
