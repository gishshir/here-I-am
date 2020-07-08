import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmiSuiviIconComponent } from './ami-suivi-icon.component';

describe('AmiSuiviIconComponent', () => {
  let component: AmiSuiviIconComponent;
  let fixture: ComponentFixture<AmiSuiviIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmiSuiviIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmiSuiviIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
