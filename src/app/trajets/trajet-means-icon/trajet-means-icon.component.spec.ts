import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetMeansIconComponent } from './trajet-means-icon.component';

describe('TrajetMeansIconComponent', () => {
  let component: TrajetMeansIconComponent;
  let fixture: ComponentFixture<TrajetMeansIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetMeansIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetMeansIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
