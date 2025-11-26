import { enableProdMode, inject, PLATFORM_ID } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
if (typeof window !== 'undefined') {
  import('swiper/element/bundle')
    .then(({ register }) => {
      register();
      return platformBrowserDynamic().bootstrapModule(AppModule);
    })
    .catch((err) => console.error(err));
} else {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
}
