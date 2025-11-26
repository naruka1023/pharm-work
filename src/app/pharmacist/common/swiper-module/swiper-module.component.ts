import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  Inject,
  Input,
  NgZone,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import {
  filterConditions,
  jobPostModel,
  jobPostPayload,
} from '../../model/typescriptModel/jobPost.model';
import { JobPostService } from '../../service/job-post.service';
import _ from 'lodash';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { FreeMode, Grid } from 'swiper/modules';
import { SsrService } from 'src/app/service/ssr.service';
import { SwiperContainer } from 'swiper/element';
@Component({
  selector: 'app-swiper-module',
  templateUrl: './swiper-module.component.html',
  styleUrls: ['./swiper-module.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SwiperModuleComponent implements AfterViewInit {
  content$!: Observable<jobPostModel[]>;
  content!: jobPostModel[];
  filterVisibleFlag: boolean = false;
  urgentFlag: boolean = false;
  subscriberFlag: any = {};
  subject!: Subscription;
  loading$!: Observable<boolean>;
  loading!: boolean;
  swiperEl!: any;
  resizeObserver!: ResizeObserver;
  collapseButton!: string;
  breakingPoint = {
    1400: {
      spaceBetween: 25,
      slidesPerView: 5,
    },
    1200: {
      spaceBetween: 25,
      slidesPerView: 4,
    },
    992: {
      slidesPerView: 3,
      spaceBetween: 25,
    },
    625: {
      slidesPerView: 2,
      spaceBetween: 25,
    },
    420: {
      spaceBetween: 20,
    },
  };
  breakingPointOperator = {
    1400: {
      slidesPerView: 5,
    },
    1000: {
      slidesPerView: 4,
    },
    550: {
      slidesPerView: 3,
    },
    300: {
      slidesPerView: 2,
    },
  };
  @ViewChild('swiperOperatorBanner', { static: false })
  swiperOperatorBanner!: ElementRef<SwiperContainer>;
  @ViewChild('swiperShortBanner', { static: false })
  swiperShortBanner!: ElementRef<SwiperContainer>;
  @ViewChild('swiperLongBanner', { static: false })
  swiperLongBanner!: ElementRef<SwiperContainer>;
  @ViewChild('swiperEmptyLongBanner', { static: false })
  swiperEmptyLongBanner!: ElementRef<SwiperContainer>;
  @ViewChild('swiperJobPost', { static: false })
  swiperJobPost!: ElementRef<SwiperContainer>;

  items = signal<any[]>([]);

  _data: filterConditions | null = null;
  @Input()
  set filterFlags(value: filterConditions | null) {
    // console.log('get loading: ', this._data?.loading);
    this._data = value;
    if (value?.content) {
      this.items.set(value.content); // update signal here safely
    } else {
      this.items.set([]);
    }
  }
  get filterFlags(): filterConditions | null {
    console.log('get loading: ', this._data?.loading);
    return this._data;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone,
    private router: Router,
    private store: Store,
    private ssrService: SsrService,
    private el: ElementRef,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.store
      .select((state: any) => {
        return state.jobpost.Banners;
      })
      .subscribe((banner: any) => {
        this.subscriberFlag = banner;
      });
    // this.loading$ = this.store.select((state:any)=>{
    //   let newState = state.jobpost.JobPost.find((jobPost: any)=>{
    //     return jobPost.CategorySymbol == this.filterFlags.CategorySymbol
    //   })
    //   return newState.loadingj
    // })
    // this.loading$.subscribe((result:any)=>{
    //   console.log(result)
    // })

    // this.content$ = this.store.select((state:any)=>{
    //   let newState = state.jobpost.JobPost.find((jobPost: any)=>{
    //     return jobPost.CategorySymbol == this.filterFlags.CategorySymbol
    //   })
    //   return newState.content
    // })
    // this.content$.subscribe((result:any)=>{
    //   console.log(result)
    // })

    this.collapseButton = '#' + this._data!.CategorySymbol;
    if (this._data!.header === 'งานเภสัชด่วนรายวัน') {
      this.urgentFlag = true;
    }
  }
  ngAfterViewInit(): void {
    if (this.ssrService.isBrowser()) {
      queueMicrotask(() => {
        if (this.swiperOperatorBanner) {
          this.swiperEl = this.swiperOperatorBanner
            .nativeElement as HTMLElement & {
            initialize?: () => void;
          };
          if (this.swiperEl && this.swiperEl.initialize) {
            Object.assign(this.swiperEl!, {
              modules: [Grid, FreeMode], // Ensure the Grid module is included
              freeMode: true,
              grid: {
                rows: 3,
                fill: 'row',
              },
              navigation: true,
              spaceBetween: 30,
              pagination: {
                clickable: true,
              },
              breakpoints: this.breakingPointOperator,
            });
            this.swiperEl.initialize();
            // ✅ Use ResizeObserver to reinitialize safely on resize/orientation changes
            this.ngZone.runOutsideAngular(() => {
              this.resizeObserver = new ResizeObserver(() => {
                this.reinitializeSwiper();
              });
              this.resizeObserver.observe(this.swiperEl);
            });
          }
        }
        if (this.swiperShortBanner) {
          const swiperE2 = this.swiperShortBanner
            .nativeElement as HTMLElement & {
            initialize?: () => void;
          };
          if (swiperE2 && swiperE2.initialize) {
            Object.assign(swiperE2!, {
              navigation: true,
              loop: true,
              slidesPerView: 1,
              centeredSlides: true,
              pagination: true,
              autoplay: { delay: 3000, disableOnInteraction: false },
            });
            swiperE2.initialize();
          }
        }
        if (this.swiperLongBanner) {
          const swiperE3 = this.swiperLongBanner
            .nativeElement as HTMLElement & {
            initialize?: () => void;
          };
          if (swiperE3 && swiperE3.initialize) {
            Object.assign(swiperE3!, {
              navigation: true,
              loop: this._data!.bannerList!.length > 1,
              slidesPerView: 1,
              centeredSlides: true,
              pagination: true,
              autoplay: { delay: 3000, disableOnInteraction: false },
            });
            swiperE3.initialize();
          }
        }
        if (this.swiperEmptyLongBanner) {
          const swiperE4 = this.swiperEmptyLongBanner
            .nativeElement as HTMLElement & {
            initialize?: () => void;
          };
          if (swiperE4 && swiperE4.initialize) {
            Object.assign(swiperE4!, {
              navigation: true,
              loop: this._data!.bannerList!.length > 1,
              slidesPerView: 1,
              centeredSlides: true,
              pagination: true,
              autoplay: { delay: 3000, disableOnInteraction: false },
            });
            swiperE4.initialize();
          }
        }
        if (this.swiperJobPost) {
          const swiperE5 = this.swiperJobPost.nativeElement as HTMLElement & {
            initialize?: () => void;
          };
          if (swiperE5 && swiperE5.initialize) {
            Object.assign(swiperE5!, {
              navigation: true,
              slidesPerView: 2,
              spaceBetween: 20,
              breakpoints: this.breakingPoint,
            });
            swiperE5.initialize();
          }
        }
      });
    }
  }

  private reinitializeSwiper() {
    // Destroy current instance if it exists
    const swiper = (this.swiperEl as any)?.swiper;
    if (swiper) swiper.destroy(true, false);

    // Reinitialize with the same config
    this.swiperEl.initialize();
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    const swiper = (this.swiperEl as any)?.swiper;
    if (swiper) swiper.destroy(true, false);
  }
  redirectExternal(link: string) {
    if (!link.includes('https://')) {
      this.document.location.href = !(
        link.includes('https://') || link.includes('http://')
      )
        ? 'https://' + link
        : link;
    }
  }

  toggleFilter() {
    this.filterVisibleFlag = !this.filterVisibleFlag;
  }

  scrollUp() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }

  goToList() {
    this.router.navigate(['jobs-list'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        CategorySymbol: this.filterFlags!.CategorySymbol,
      },
    });
  }
}
