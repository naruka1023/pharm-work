import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerSellPageComponent } from './banner-sell-page.component';

describe('BannerSellPageComponent', () => {
  let component: BannerSellPageComponent;
  let fixture: ComponentFixture<BannerSellPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannerSellPageComponent]
    });
    fixture = TestBed.createComponent(BannerSellPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
