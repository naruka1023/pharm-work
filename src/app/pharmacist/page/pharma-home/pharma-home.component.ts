import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  filterConditions,
  jobPostModel,
  jobPostPayload,
  userOperator,
} from '../../model/typescriptModel/jobPost.model';
import {
  retrievedJobSuccess,
  setBanner,
} from '../../state/actions/job-post.actions';
import { JobPostService } from '../../service/job-post.service';
import headerArray from '../../model/data/uiKeys';
import _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { bannerOperator } from '../../model/typescriptModel/users.model';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { SsrService } from 'src/app/service/ssr.service';

@Component({
  selector: 'app-pharma-home',
  templateUrl: './pharma-home.component.html',
  styleUrls: ['./pharma-home.component.css'],
})
export class PharmaHomeComponent {
  loadingFlag: boolean = true;
  allJobs!: jobPostModel[];
  loadingFlag$!: Observable<boolean>;
  localItem: filterConditions[] = [];
  jobPostUID!: string;
  a1Banner: any = [];
  type!: string;
  content$!: Observable<filterConditions[]>;
  items$!: Observable<filterConditions[]>;
  swiperElRef!: any;
  breakingPointOperator = {
    1400: {
      slidesPerView: 1.5,
    },
    1200: {
      slidesPerView: 2,
    },
    966: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 1.5,
    },
  };
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private jobPostService: JobPostService,
    private el: ElementRef,
    private ssrService: SsrService,
    private store: Store
  ) {}
  ngOnInit() {
    this.store
      .select((state: any) => {
        return state.jobpost.Banners.A1;
      })
      .subscribe((banner) => {
        if (banner !== undefined) {
          this.a1Banner = banner;
        }
      });
    this.loadingFlag$ = this.store.select(
      (state: any) => state.jobpost.loading
    );

    this.loadingFlag$.subscribe((flag) => {
      if (flag) {
        this.jobPostService.dispatchJobs();
      }
    });

    this.items$ = this.store.select((state: any) => {
      return state.jobpost.JobPost;
    });
    this.items$.subscribe((item) => {
      this.localItem = item;
    });
  }
  injectSlideStyles() {
    const _className = Object.entries(this.breakingPointOperator).map(
      ([key, value]) => {
        const { slidesPerView = 1, spaceBetween: gap = 20 } = value as {
          slidesPerView?: number;
          spaceBetween?: number;
        };
        return `
       @media (min-width: ${key}px) {
          .slide-head{ 
            display:block;
            width: calc((100% - ${
              (slidesPerView - 1) * gap
            }px) / ${slidesPerView});
            margin-right: ${gap}px;
          }            
        }`;
      }
    );
    const style = this.document.createElement('style');
    style.innerHTML = _className.join('\n');
    this.document.head.appendChild(style);
  }
  ngAfterViewInit(): void {
    if (this.ssrService.isServer()) {
      this.injectSlideStyles();
    }
    if (this.ssrService.isBrowser()) {
      this.type = localStorage.getItem('type')!;
      this.jobPostUID = localStorage.getItem('jobUID')!;

      // this.scrollUp()
      if (this.type != null) {
        this.route.navigate(['notifications'], {
          relativeTo: this.activatedRoute,
          queryParams: {
            jobUID: this.jobPostUID,
            type: this.type,
          },
        });
      }
    }
  }
  redirectExternal(link: string) {
    if (!link.includes('https://')) {
      this.document.location.href = !link.includes('https://')
        ? 'https://' + link
        : link;
    }
  }

  shuffle(inputArray: string[]) {
    let array = [...inputArray];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  dispatchJobs() {
    let categorySymbols = headerArray.map(
      (header: filterConditions) => header.CategorySymbol
    );
    let promises: Promise<any>[] = [];
    let countPromises: Promise<{
      categorySymbol: string;
      count: number;
    }>[] = [];
    this.jobPostService.getBanners().then((banner) => {
      let ref: any = banner.data()!;
      this.store.dispatch(setBanner({ banner: ref }));
      categorySymbols.forEach((categorySymbol: string) => {
        countPromises.push(
          this.jobPostService.getCategorySymbolCount(categorySymbol)
        );
      });
      Promise.all(countPromises).then((countPayload) => {
        let newCountPayload: {
          [key: string]: number;
        } = {};
        countPayload.forEach((cP) => {
          newCountPayload[cP.categorySymbol] = cP.count;
        });
        categorySymbols.forEach((categorySymbol: string) => {
          switch (categorySymbol) {
            case 'CB':
              let idList2: string[] = headerArray.find((header) => {
                return header.CategorySymbol == 'CB';
              })!.idList!;
              promises.push(
                this.jobPostService
                  .getOperatorsByType(idList2)
                  .then((operators) => {
                    let res: jobPostPayload = {
                      UserOperator: operators,
                      CategorySymbol: categorySymbol,
                    };
                    return res;
                  })
              );
              break;
            case 'BA':
              let resultBanner: string[] = ref['B2'];
              if (resultBanner.length > 0) {
                resultBanner = this.shuffle(resultBanner);
                if (resultBanner.length > 12) {
                  resultBanner = resultBanner.slice(0, 12);
                }
                ref = {
                  ...ref,
                  B2: resultBanner,
                };
              }
              let B1Banner: string[] = [];
              switch (ref['B1'].length) {
                case 0:
                  B1Banner = B1Banner.concat(ref['B1']).concat(['', '', '']);
                  break;
                case 1:
                  B1Banner = B1Banner.concat(ref['B1']).concat(['', '']);
                  break;
                case 2:
                  B1Banner = B1Banner.concat(ref['B1']).concat(['']);
                  break;
                case 3:
                  B1Banner = B1Banner.concat(ref['B1']);
                  break;
                default:
                  B1Banner = B1Banner.concat(ref['B1']);
              }
              let idList: string[] = B1Banner.concat(ref['B2']);
              promises.push(
                this.jobPostService
                  .getOperatorsByType(idList)
                  .then((operators) => {
                    let res: jobPostPayload = {
                      UserOperator: operators,
                      CategorySymbol: categorySymbol,
                    };
                    return res;
                  })
              );
              break;
            default:
              promises.push(
                this.jobPostService
                  .getJobCategoryServiceSmall(categorySymbol)
                  .then((jobPosts) => {
                    let res: jobPostPayload = {
                      JobsPost: jobPosts,
                      CategorySymbol: categorySymbol,
                      count: newCountPayload[categorySymbol],
                    };
                    return res;
                  })
              );
              break;
          }
        });
        Promise.all(promises).then((jobs: jobPostPayload[]) => {
          let newJobs: {
            [key: string]: jobPostPayload;
          } = {};
          jobs.forEach((job: jobPostPayload) => {
            newJobs[job.CategorySymbol] = job;
          });
          let finalPayload: filterConditions[] = headerArray.map(
            (header: filterConditions) => {
              let payload: filterConditions = {
                ...header,
                content:
                  newJobs[header.CategorySymbol].CategorySymbol == 'BA' ||
                  newJobs[header.CategorySymbol].CategorySymbol == 'CB'
                    ? newJobs[header.CategorySymbol].UserOperator
                    : newJobs[header.CategorySymbol].JobsPost,
                loading: false,
                count: newJobs[header.CategorySymbol].count!,
              };
              if (
                header.CategorySymbol == 'A2' ||
                header.CategorySymbol == 'A3' ||
                header.CategorySymbol == 'A4'
              ) {
                if (ref[header.CategorySymbol] !== undefined) {
                  payload = {
                    ...payload,
                    bannerList: ref[header.CategorySymbol],
                  };
                }
              }
              if (header.CategorySymbol == 'BA') {
                payload = {
                  ...payload,
                  idList: ref['B1'].concat(ref['B2']),
                };
              }
              if (
                newJobs[header.CategorySymbol].CategorySymbol == 'BA' ||
                newJobs[header.CategorySymbol].CategorySymbol == 'CB'
              ) {
                const complementaryCount = 15 - payload.content!.length;
                let i = 0;
                while (i < complementaryCount) {
                  i++;
                  payload.content?.push('empty');
                }
              }
              return payload;
            }
          );
          this.store.dispatch(retrievedJobSuccess({ jobs: finalPayload }));
        });
      });
    });
  }

  scrollUp() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }
}
