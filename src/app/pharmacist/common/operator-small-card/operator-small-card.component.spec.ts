import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorSmallCardComponent } from './operator-small-card.component';

describe('OperatorSmallCardComponent', () => {
  let component: OperatorSmallCardComponent;
  let fixture: ComponentFixture<OperatorSmallCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorSmallCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorSmallCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
