import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorNormalCardComponent } from './operator-normal-card.component';

describe('OperatorNormalCardComponent', () => {
  let component: OperatorNormalCardComponent;
  let fixture: ComponentFixture<OperatorNormalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorNormalCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorNormalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
