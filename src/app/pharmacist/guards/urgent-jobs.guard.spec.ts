import { TestBed } from '@angular/core/testing';

import { UrgentJobsGuard } from './urgent-jobs.guard';

describe('UrgentJobsGuard', () => {
  let guard: UrgentJobsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UrgentJobsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
