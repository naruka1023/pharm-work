import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalUserCardComponent } from './normal-user-card.component';

describe('NormalUserCardComponent', () => {
  let component: NormalUserCardComponent;
  let fixture: ComponentFixture<NormalUserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NormalUserCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NormalUserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
