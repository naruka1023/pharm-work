import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorDetailsComponent } from './operator-details.component';

describe('OperatorDetailsComponent', () => {
  let component: OperatorDetailsComponent;
  let fixture: ComponentFixture<OperatorDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperatorDetailsComponent]
    });
    fixture = TestBed.createComponent(OperatorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
