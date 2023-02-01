import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorProfileComponent } from './operator-profile.component';

describe('OperatorProfileComponent', () => {
  let component: OperatorProfileComponent;
  let fixture: ComponentFixture<OperatorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
