import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetDetailComponent } from './trajet-detail.component';

describe('TrajetDetailComponent', () => {
  let component: TrajetDetailComponent;
  let fixture: ComponentFixture<TrajetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
