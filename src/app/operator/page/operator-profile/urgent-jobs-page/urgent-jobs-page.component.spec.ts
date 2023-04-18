import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentJobsPageComponent } from './urgent-jobs-page.component';

describe('UrgentJobsPageComponent', () => {
  let component: UrgentJobsPageComponent;
  let fixture: ComponentFixture<UrgentJobsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrgentJobsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrgentJobsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
