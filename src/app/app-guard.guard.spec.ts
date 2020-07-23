import { TestBed } from '@angular/core/testing';

import { AppGuardGuard } from './app-guard.guard';

describe('AppGuardGuard', () => {
  let guard: AppGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AppGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
