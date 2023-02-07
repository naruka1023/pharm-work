import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorHomeComponent } from './operator-home.component';

describe('OperatorHomeComponent', () => {
  let component: OperatorHomeComponent;
  let fixture: ComponentFixture<OperatorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
