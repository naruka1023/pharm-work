import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelCheckoutComponent } from './cancel-checkout.component';

describe('CancelCheckoutComponent', () => {
  let component: CancelCheckoutComponent;
  let fixture: ComponentFixture<CancelCheckoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelCheckoutComponent]
    });
    fixture = TestBed.createComponent(CancelCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
