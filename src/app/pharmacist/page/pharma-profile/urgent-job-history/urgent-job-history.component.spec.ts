import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentJobHistoryComponent } from './urgent-job-history.component';

describe('UrgentJobHistoryComponent', () => {
  let component: UrgentJobHistoryComponent;
  let fixture: ComponentFixture<UrgentJobHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrgentJobHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrgentJobHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
