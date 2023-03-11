import { TestBed } from '@angular/core/testing';

import { OperatorPageGuard } from './operator-page.guard';

describe('OperatorPageGuard', () => {
  let guard: OperatorPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OperatorPageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
