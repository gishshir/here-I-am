import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoportailComponent } from './geoportail.component';

describe('GeoportailComponent', () => {
  let component: GeoportailComponent;
  let fixture: ComponentFixture<GeoportailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoportailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoportailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
