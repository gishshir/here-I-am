import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionRelComponent } from './action-rel.component';

describe('ActionRelComponent', () => {
  let component: ActionRelComponent;
  let fixture: ComponentFixture<ActionRelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionRelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionRelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
