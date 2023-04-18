import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentJobsHistoryComponent } from './urgent-jobs-history.component';

describe('UrgentJobsHistoryComponent', () => {
  let component: UrgentJobsHistoryComponent;
  let fixture: ComponentFixture<UrgentJobsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrgentJobsHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrgentJobsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
