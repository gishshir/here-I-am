import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlerteAmiMenuComponent } from './alerte-ami-menu.component';

describe('AlerteAmiMenuComponent', () => {
  let component: AlerteAmiMenuComponent;
  let fixture: ComponentFixture<AlerteAmiMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlerteAmiMenuComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlerteAmiMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
