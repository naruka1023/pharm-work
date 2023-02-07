import { TestBed } from '@angular/core/testing';

import { ProfileOperatorGuard } from './profile-operator.guard';

describe('ProfileOperatorGuard', () => {
  let guard: ProfileOperatorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProfileOperatorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
