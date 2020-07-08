import { TestBed } from '@angular/core/testing';

import { AmiService } from './ami.service';

describe('AmiService', () => {
  let service: AmiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
