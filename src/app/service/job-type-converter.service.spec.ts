import { TestBed } from '@angular/core/testing';

import { JobTypeConverterService } from './job-type-converter.service';

describe('JobTypeConverterService', () => {
  let service: JobTypeConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobTypeConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
