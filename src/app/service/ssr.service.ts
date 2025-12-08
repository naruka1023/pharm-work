// src/app/core/services/platform.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SsrService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  private static counter = 0;
  private appPrefix = 'slide-';

  generateId(): string {
    return `${this.appPrefix}${SsrService.counter++}`;
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isServer(): boolean {
    return isPlatformServer(this.platformId);
  }
}
