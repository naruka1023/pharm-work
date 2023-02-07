import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllJobsPostsComponent } from './all-jobs-posts.component';

describe('AllJobsPostsComponent', () => {
  let component: AllJobsPostsComponent;
  let fixture: ComponentFixture<AllJobsPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllJobsPostsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllJobsPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
