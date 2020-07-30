import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetCommonComponent } from './trajet-common.component';

describe('TrajetCommonComponent', () => {
  let component: TrajetCommonComponent;
  let fixture: ComponentFixture<TrajetCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
