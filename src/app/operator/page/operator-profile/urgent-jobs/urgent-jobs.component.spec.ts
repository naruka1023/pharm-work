import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentJobsComponent } from './urgent-jobs.component';

describe('UrgentJobsComponent', () => {
  let component: UrgentJobsComponent;
  let fixture: ComponentFixture<UrgentJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrgentJobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrgentJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
