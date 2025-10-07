import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaSellPageComponent } from './social-media-sell-page.component';

describe('SocialMediaSellPageComponent', () => {
  let component: SocialMediaSellPageComponent;
  let fixture: ComponentFixture<SocialMediaSellPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialMediaSellPageComponent]
    });
    fixture = TestBed.createComponent(SocialMediaSellPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
