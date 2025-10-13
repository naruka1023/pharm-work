import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
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
@Component({
  selector: 'app-swiper-module',
  templateUrl: './swiper-module.component.html',
  styleUrls: ['./swiper-module.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SwiperModuleComponent implements AfterViewInit {
  @Input() filterFlags!: filterConditions;
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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone,
    private router: Router,
    private store: Store,
    private el: ElementRef,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log(this.filterFlags.content);
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

    this.collapseButton = '#' + this.filterFlags.CategorySymbol;
    if (this.filterFlags.header === 'งานเภสัชด่วนรายวัน') {
      this.urgentFlag = true;
    }
  }
  ngAfterViewInit(): void {
    this.swiperEl = this.el.nativeElement.querySelector('.operatorBanner')!;
    if (!this.swiperEl) return;
    Object.assign(this.swiperEl!, {
      modules: [Grid, FreeMode], // Ensure the Grid module is included
      freeMode: true,
      grid: {
        rows: 3, // Number of rows in the grid
        fill: 'row', // How slides fill the grid ('row' or 'column')
      },
      navigation: true,
      spaceBetween: 30, // Space between slides
      pagination: {
        clickable: true,
      },
      breakpoints: this.breakingPointOperator,
    });

    // ✅ Use ResizeObserver to reinitialize safely on resize/orientation changes
    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => {
        this.reinitializeSwiper();
      });
      this.resizeObserver.observe(this.swiperEl);
    });
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
        CategorySymbol: this.filterFlags.CategorySymbol,
      },
    });
  }
}
