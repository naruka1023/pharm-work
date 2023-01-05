import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostNormalCardComponent } from './job-post-normal-card.component';

describe('JobPostNormalCardComponent', () => {
  let component: JobPostNormalCardComponent;
  let fixture: ComponentFixture<JobPostNormalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPostNormalCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobPostNormalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
