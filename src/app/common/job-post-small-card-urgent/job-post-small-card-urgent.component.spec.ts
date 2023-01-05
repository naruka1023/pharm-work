import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostSmallCardUrgentComponent } from './job-post-small-card-urgent.component';

describe('JobPostSmallCardUrgentComponent', () => {
  let component: JobPostSmallCardUrgentComponent;
  let fixture: ComponentFixture<JobPostSmallCardUrgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPostSmallCardUrgentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobPostSmallCardUrgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
