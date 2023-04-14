import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferredJobsComponent } from './preferred-jobs.component';

describe('PreferredJobsComponent', () => {
  let component: PreferredJobsComponent;
  let fixture: ComponentFixture<PreferredJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferredJobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferredJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
