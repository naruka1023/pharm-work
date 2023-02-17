import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestJobsComponent } from './request-jobs.component';

describe('RequestJobsComponent', () => {
  let component: RequestJobsComponent;
  let fixture: ComponentFixture<RequestJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestJobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
