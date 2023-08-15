import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostSmallCardComponent } from './job-post-small-card.component';

describe('JobPostSmallCardComponent', () => {
  let component: JobPostSmallCardComponent;
  let fixture: ComponentFixture<JobPostSmallCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPostSmallCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobPostSmallCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
