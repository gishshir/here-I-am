import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteRelationComponent } from './dialog-delete-relation.component';

describe('DialogDeleteComponent', () => {
  let component: DialogDeleteRelationComponent;
  let fixture: ComponentFixture<DialogDeleteRelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogDeleteRelationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
