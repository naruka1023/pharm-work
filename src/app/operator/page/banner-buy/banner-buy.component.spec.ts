import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerBuyComponent } from './banner-buy.component';

describe('BannerBuyComponent', () => {
  let component: BannerBuyComponent;
  let fixture: ComponentFixture<BannerBuyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannerBuyComponent]
    });
    fixture = TestBed.createComponent(BannerBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
