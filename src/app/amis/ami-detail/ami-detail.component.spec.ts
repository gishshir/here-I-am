import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmiDetailComponent } from './ami-detail.component';

describe('AmiDetailComponent', () => {
  let component: AmiDetailComponent;
  let fixture: ComponentFixture<AmiDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmiDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
