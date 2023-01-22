import { TestBed } from '@angular/core/testing';

import { JobListGuard } from './jobList.guard';

describe('JobListGuard', () => {
  let guard: JobListGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(JobListGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
