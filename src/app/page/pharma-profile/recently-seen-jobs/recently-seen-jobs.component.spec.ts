import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlySeenJobsComponent } from './recently-seen-jobs.component';

describe('RecentlySeenJobsComponent', () => {
  let component: RecentlySeenJobsComponent;
  let fixture: ComponentFixture<RecentlySeenJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentlySeenJobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlySeenJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
