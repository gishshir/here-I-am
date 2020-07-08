import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetsComponent } from './trajets.component';

describe('TrajetsComponent', () => {
  let component: TrajetsComponent;
  let fixture: ComponentFixture<TrajetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
