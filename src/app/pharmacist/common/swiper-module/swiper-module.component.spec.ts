import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperModuleComponent } from './swiper-module.component';

describe('SwiperModuleComponent', () => {
  let component: SwiperModuleComponent;
  let fixture: ComponentFixture<SwiperModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwiperModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwiperModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
