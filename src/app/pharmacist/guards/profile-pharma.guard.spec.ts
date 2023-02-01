import { TestBed } from '@angular/core/testing';

import { ProfilePharmaGuard } from './profile-pharma.guard';

describe('ProfilePharmaGuard', () => {
  let guard: ProfilePharmaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProfilePharmaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
