import { TestBed } from '@angular/core/testing';

import { TrajetService } from './trajet.service';

describe('TrajetService', () => {
  let service: TrajetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrajetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
