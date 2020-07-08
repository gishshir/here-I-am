import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmiStateIconComponent } from './ami-state-icon.component';

describe('AmiStateIconComponent', () => {
  let component: AmiStateIconComponent;
  let fixture: ComponentFixture<AmiStateIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmiStateIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmiStateIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
