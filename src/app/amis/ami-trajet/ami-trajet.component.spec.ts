import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmiTrajetComponent } from './ami-trajet.component';

describe('AmiTrajetComponent', () => {
  let component: AmiTrajetComponent;
  let fixture: ComponentFixture<AmiTrajetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmiTrajetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmiTrajetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
