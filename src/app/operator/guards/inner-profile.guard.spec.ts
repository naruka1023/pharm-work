import { TestBed } from '@angular/core/testing';

import { InnerProfileGuard } from './inner-profile.guard';

describe('InnerProfileGuard', () => {
  let guard: InnerProfileGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InnerProfileGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
