// swiper-browser.module.ts
import { NgModule, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@NgModule()
export class SwiperBrowserModule {
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      import('swiper/element/bundle').then(({ register }) => register());
    }
  }
}
