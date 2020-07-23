import { TestBed } from '@angular/core/testing';

import { StartingGuard } from './starting.guard';

describe('StartingGuard', () => {
  let guard: StartingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StartingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
