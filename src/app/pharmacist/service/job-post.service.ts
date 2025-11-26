import { Injectable, TransferState, inject, makeStateKey } from '@angular/core';
import * as _ from 'lodash';
import { Observable, of, Subject } from 'rxjs';
import {
  Bookmark,
  filterConditions,
  Follow,
  jobPostModel,
  jobPostPayload,
  jobRequest,
  JobSearchForm,
  userOperator,
} from '../model/typescriptModel/jobPost.model';
import headerArray from '../model/data/uiKeys';
import algoliasearch, { SearchIndex } from 'algoliasearch/lite';
import { algoliaEnvironment, url } from 'src/environments/environment';
import {
  collection,
  getCountFromServer,
  query,
  where,
  getDocs,
  doc,
  onSnapshot,
  Unsubscribe,
  addDoc,
  deleteDoc,
  getDoc,
  orderBy,
  limit,
} from 'firebase/firestore';
import {
  addBookmark,
  addJobRequest,
  followOperator,
  removeBookmark,
  removeJobRequest,
  retrievedJobSuccess,
  setBanner,
} from '../state/actions/job-post.actions';
import { Store } from '@ngrx/store';
import { UtilService } from './util.service';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FirebaseService } from 'src/app/service/firebase.service';
import { SsrService } from 'src/app/service/ssr.service';

const client = algoliasearch(
  algoliaEnvironment.app_id,
  algoliaEnvironment.api_key
);
const JOBS_STATE_KEY = makeStateKey<any>('jobs-data');

@Injectable({
  providedIn: 'root',
})
export class JobPostService {
  hitsPerPage: number = 8;
  RecentlySeenSubject: Subject<void> = new Subject();

  constructor(
    private firebaseService: FirebaseService,
    private http: HttpClient,
    private utilService: UtilService,
    private ssrService: SsrService,
    private transferState: TransferState,
    private store: Store
  ) {}
  private firestore = this.firebaseService.firestore;

  getRecentlySeenSubject(): Observable<void> {
    return this.RecentlySeenSubject.asObservable();
  }

  sendRecentlySeenSubject() {
    return this.RecentlySeenSubject.next();
  }
  getBanners() {
    return getDoc(doc(this.firestore, 'banners', 'subs'));
  }
  async getUserBookmark(userUID: string): Promise<Bookmark[]> {
    let bookmarkCol = await getDocs(
      query(
        collection(this.firestore, 'bookmark'),
        where('userUID', '==', userUID)
      )
    );
    return bookmarkCol.docs.map((bookmark) => {
      return {
        ...bookmark.data(),
        bookmarkUID: bookmark.id,
      } as Bookmark;
    });
  }

  async dispatchJobs() {
    if (
      this.ssrService.isBrowser() &&
      this.transferState.hasKey(JOBS_STATE_KEY)
    ) {
      this.store.dispatch(
        retrievedJobSuccess({
          jobs: this.transferState.get(JOBS_STATE_KEY, []),
        })
      );
      this.transferState.remove(JOBS_STATE_KEY);
      return;
    }
    let categorySymbols = headerArray.map(
      (header: filterConditions) => header.CategorySymbol
    );
    let promises: Promise<any>[] = [];
    let countPromises: Promise<{
      categorySymbol: string;
      count: number;
    }>[] = [];
    const banner = await this.getBanners();
    let ref: any = banner.data()!;
    this.store.dispatch(setBanner({ banner: ref }));
    categorySymbols.forEach((categorySymbol: string) => {
      countPromises.push(this.getCategorySymbolCount(categorySymbol));
    });
    const countPayload = await Promise.all(countPromises);
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
            this.getOperatorsByType(idList2).then((operators) => {
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
            this.getOperatorsByType(idList).then((operators) => {
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
            this.getJobCategoryServiceSmall(categorySymbol).then((jobPosts) => {
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
    const jobs = await Promise.all(promises);

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
    if (this.ssrService.isServer()) {
      this.transferState.set(JOBS_STATE_KEY, finalPayload);
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

  getJobFromBookmark(bookmark: Bookmark): Unsubscribe {
    return onSnapshot(
      doc(this.firestore, 'job-post', bookmark.jobUID),
      (job) => {
        if (!job.exists()) {
          this.store.dispatch(
            removeBookmark({
              jobUID: bookmark.jobUID!,
              userUID: bookmark.userUID!,
            })
          );
          this.utilService.sendRemoveBookmarkSubject(bookmark.userUID);
        } else {
          let jobData: jobPostModel = {
            ...(job.data() as jobPostModel),
            custom_doc_id: job.id,
          };
          this.store.dispatch(
            addBookmark({
              jobUID: bookmark.jobUID!,
              userUID: bookmark.userUID!,
              bookmarkUID: bookmark.bookmarkUID!,
              JobPost: jobData,
            })
          );
        }
      }
    );
  }

  async getCategorySymbolCount(
    categorySymbol: string
  ): Promise<{ categorySymbol: string; count: number }> {
    const col = query(
      collection(this.firestore, 'job-post'),
      where('Active', '==', true),
      where('CategorySymbol', '==', categorySymbol)
    );
    const snapshot = await getCountFromServer(col);
    return {
      categorySymbol: categorySymbol,
      count: snapshot.data().count,
    };
  }

  async getJobOfOperator(operatorUID: string): Promise<jobPostModel[]> {
    let jobCol = await getDocs(
      query(
        collection(this.firestore, 'job-post'),
        where('OperatorUID', '==', operatorUID),
        where('Active', '==', true)
      )
    );
    return jobCol.docs.map((job) => {
      return {
        ...job.data(),
        custom_doc_id: job.id,
      } as jobPostModel;
    });
  }

  async getUrgentJobOfOperator(operatorUID: string): Promise<jobPostModel[]> {
    let jobCol = await getDocs(
      query(
        collection(this.firestore, 'job-post'),
        where('OperatorUID', '==', operatorUID),
        where('Urgency', '==', true),
        where('Active', '==', true)
      )
    );

    return jobCol.docs.map((job) => {
      return {
        ...job.data(),
        custom_doc_id: job.id,
      } as jobPostModel;
    });
  }

  addBookmarkService(jobUID: string, userUID: string) {
    let payload: Partial<Bookmark> = {
      jobUID: jobUID,
      userUID: userUID,
    };
    return addDoc(collection(this.firestore, 'bookmark'), payload);
  }

  removeBookMarkService(bookmarkID: string) {
    return deleteDoc(doc(this.firestore, 'bookmark', bookmarkID));
  }

  async getJob(jobUID: string): Promise<jobPostModel> {
    let job = await getDoc(doc(this.firestore, 'job-post', jobUID));
    return {
      ...job.data(),
      custom_doc_id: job.id,
    } as jobPostModel;
  }

  getJobFromJobRequest(id: string, jobRequest: jobRequest): Unsubscribe {
    return onSnapshot(doc(this.firestore, 'job-post', id), (job) => {
      if (!job.exists()) {
        this.store.dispatch(
          removeJobRequest({
            jobRequest: {
              ...jobRequest,
            },
          })
        );
        this.utilService.sendRemoveRequestSubject(job.id);
      } else {
        let newJob = {
          ...job.data(),
          custom_doc_id: job.id,
        };
        this.store.dispatch(
          addJobRequest({
            jobRequest: {
              ...jobRequest,
              JobPost: newJob as jobPostModel,
            },
          })
        );
      }
    });
  }

  getRequestJob2(userID: string) {
    return onSnapshot(
      query(
        collection(this.firestore, 'job-request'),
        where('userUID', '==', userID)
      ),
      (jobRequest) => {
        return jobRequest.docChanges().map((value) => {
          let requestViewPayload = {
            payload: {
              ...(value.doc.data() as jobRequest),
              custom_doc_uid: value.doc.id,
            },
            type: value.type,
          };
        });
      }
    );
  }
  getRequestJob(userID: string) {
    return getDocs(
      query(
        collection(this.firestore, 'job-request'),
        where('userUID', '==', userID)
      )
    );
  }

  requestJob(
    fullName: string,
    imageUrl: string,
    jobID: string,
    operatorID: string,
    userID: string,
    jobName: string
  ) {
    const params = new HttpParams()
      .set('imageUrl', imageUrl)
      .set('fullName', fullName)
      .set('operatorUID', operatorID)
      .set('userUID', userID)
      .set('jobName', jobName);

    this.http
      .get(url.jobRequestNotification, {
        params: params,
      })
      .subscribe((dd) => {
        console.log(dd);
      });
    let payload: jobRequest = {
      operatorUID: operatorID,
      userUID: userID,
      jobUID: jobID,
    };
    return addDoc(collection(this.firestore, 'job-request'), payload);
  }

  cancelRequest(jobRequestUID: string) {
    return deleteDoc(doc(this.firestore, 'job-request', jobRequestUID));
  }

  getJobCategoryService(CategorySymbol: string, paginationIndex: number) {
    let index: SearchIndex = client.initIndex(
      'pharm-work_index_dateUpdated_desc'
    );
    return index.search('', {
      hitsPerPage: this.hitsPerPage,
      page: paginationIndex,
      filters: 'Active:true AND CategorySymbol:' + CategorySymbol,
    });
  }
  getJobNearUs(CategorySymbol: string, markerPosition: any) {
    let index: SearchIndex = client.initIndex('pharm-work_index');
    let searchOptions = {
      filters: 'Active:true AND CategorySymbol:' + CategorySymbol,
      aroundLatLng: markerPosition.lat + ', ' + markerPosition.lng,
      aroundRadius: 1000,
    };
    return index.search('', searchOptions);
  }

  paginateJobCategoryResultsService(
    form: FormGroup<any>,
    CategorySymbol: string,
    paginationIndex: number,
    query: string,
    indexName2: string,
    nearMapFlag: boolean
  ) {
    let index: SearchIndex = client.initIndex(indexName2);
    let searchOptions: any = {
      hitsPerPage: this.hitsPerPage,
      page: paginationIndex,
      filters: query,
    };
    if (nearMapFlag) {
      searchOptions.aroundLatLng =
        form.value._geoloc?.lat + ', ' + form.value._geoloc?.lng;
      searchOptions.aroundRadius = form.value.radius;
    }
    return index.search('', searchOptions);
  }

  getOperatorsByType(idList: string[]) {
    let promises: Promise<any>[] = [];
    idList.forEach((operatorID: string) => {
      promises.push(
        operatorID == ''
          ? new Promise((resolve) => {
              resolve('empty');
            })
          : getDoc(doc(this.firestore, 'users', operatorID))
      );
    });
    return Promise.all(promises).then((operator) => {
      let payload: any[] = [];
      operator.forEach((value: any) => {
        if (value == 'empty') {
          payload.push('empty');
        } else {
          payload.push({
            ...value.data(),
            uid: value.id,
            loadingOperator: true,
          });
        }
      });
      return payload;
    });
  }

  async getJobCategoryServiceAll(CategorySymbol: string) {
    let docs = await getDocs(
      query(
        collection(this.firestore, 'job-post'),
        where('CategorySymbol', '==', CategorySymbol),
        where('Active', '==', true),
        orderBy('dateUpdatedUnix', 'desc')
      )
    );
    return docs.docs.map((doc) => {
      return {
        ...doc.data(),
        custom_doc_id: doc.id,
      } as jobPostModel;
    });
  }

  async getJobCategoryServiceSmall(CategorySymbol: string) {
    let docs = await getDocs(
      query(
        collection(this.firestore, 'job-post'),
        where('CategorySymbol', '==', CategorySymbol),
        where('Active', '==', true),
        orderBy('dateUpdatedUnix', 'desc'),
        limit(7)
      )
    );
    return docs.docs.map((doc) => {
      return {
        ...doc.data(),
        custom_doc_id: doc.id,
      } as jobPostModel;
    });
    // let index:SearchIndex = client.initIndex('pharm-work_index_dateUpdated_desc')
    // return index.search('',{
    //   hitsPerPage:5,
    //   page:0,
    //   facetFilters: [
    //     "Active:true",
    //     "CategorySymbol:" + CategorySymbol
    //   ]
    // })
  }

  followOperator(follow: Follow) {
    return addDoc(collection(this.firestore, 'followers'), follow);
  }

  unfollowOperator(followUID: string) {
    return deleteDoc(doc(this.firestore, 'followers', followUID));
  }
  getOperatorFromFollows(operatorIDList: string[]) {
    let promises: Promise<any>[] = [];
    operatorIDList.forEach((operatorID: string) => {
      promises.push(getDoc(doc(this.firestore, 'users', operatorID)));
    });
    return Promise.all(promises).then((operator) => {
      let payload: any = {};
      operator.forEach((value: any) => {
        let payloadInner = value.data() as userOperator;
        payload[value.id] = payloadInner;
      });
      return payload as {
        [key: string]: userOperator;
      };
    });
  }

  getOperatorFromUID(operatorUID: string) {
    return getDoc(doc(this.firestore, 'users', operatorUID));
  }

  getFollowers(userID: string) {
    return getDocs(
      query(
        collection(this.firestore, 'followers'),
        where('userUID', '==', userID)
      )
    );
  }

  async searchJobs(form: JobSearchForm) {
    let newForm: any = _.cloneDeep(form);
    let sortByPrice: boolean = false;
    let queries: any = [];
    let dateQueries: any = [];
    let numericQueries: any = [];
    let finalSearchOption: any = {};

    Object.keys(newForm).forEach((newFormField) => {
      if (newForm[newFormField] !== '' && newForm[newFormField] !== undefined) {
        switch (newFormField) {
          case 'Salary':
            sortByPrice = true;
            queries.push('Salary.Amount >= ' + newForm[newFormField]);
            break;
          case 'DateOfJob':
            dateQueries = newForm[newFormField].map(
              (field: string) => "DateOfJob:'" + field + "'"
            );
            break;
          case '_geoloc':
            break;
          case 'radius':
            break;
          case 'nearbyFlag':
            break;
          case 'Location':
            break;
          case 'BTS':
            queries.push('BTS.Near:true');
            queries.push("BTS.Station:'" + newForm[newFormField] + "'");
            break;
          case 'MRT':
            queries.push('MRT.Near:true');
            queries.push("MRT.Station:'" + newForm[newFormField] + "'");
            break;
          case 'OnlineInterview':
            if (newForm[newFormField]) {
              queries.push(newFormField + ":'" + newForm[newFormField] + "'");
            }
            break;
          default:
            queries.push(newFormField + ":'" + newForm[newFormField] + "'");
            break;
        }
      }
    });
    if (dateQueries.length > 0) {
      queries.push(dateQueries);
    }
    queries.push('Active:true');
    if (numericQueries.length > 0) {
      finalSearchOption = {
        ...finalSearchOption,
        numericFilters: numericQueries,
      };
    }
    let queryString = '';
    queries.forEach((query: any, indexs: number) => {
      if (!Array.isArray(query)) {
        if (indexs == 0) {
          queryString += query;
        } else {
          queryString += ' AND ' + query;
        }
      } else {
        let innerQueryString = '';
        query.forEach((innerQuery: any, index: number) => {
          if (index == 0) {
            innerQueryString += innerQuery;
          } else {
            innerQueryString += ' OR ' + innerQuery;
          }
        });
        queryString += ' AND (' + innerQueryString + ')';
      }
    });
    let indexName = !sortByPrice
      ? 'pharm-work_index_dateUpdated_desc'
      : 'pharm-work_index_salary_asc';
    let index: SearchIndex = client.initIndex(indexName);
    let requestOptions: any = {
      hitsPerPage: this.hitsPerPage,
      page: 0,
    };
    if (form._geoloc !== undefined) {
      if (form.nearbyFlag) {
        requestOptions.aroundLatLng =
          form._geoloc?.lat + ', ' + form._geoloc?.lng;
        if (form.radius !== '') {
          requestOptions.aroundRadius = form.radius;
        }
      } else {
        if (form.Location.Section !== '') {
          queryString += ' AND Location.Section:' + form.Location.Section;
        }
        if (form.Location.District !== '') {
          queryString += ' AND Location.District:' + form.Location.District;
        }
        if (form.Location.Province !== '') {
          queryString += ' AND Location.Province:' + form.Location.Province;
        }
      }
    } else {
      if (form.Location.Section !== '') {
        queryString += ' AND Location.Section:' + form.Location.Section;
      }
      if (form.Location.District !== '') {
        queryString += ' AND Location.District:' + form.Location.District;
      }
      if (form.Location.Province !== '') {
        queryString += ' AND Location.Province:' + form.Location.Province;
      }
    }
    requestOptions.filters = queryString;
    let searchResult = await index.search('', requestOptions);
    return {
      result: searchResult,
      query: queryString,
      indexName: indexName,
    };
  }

  initFilterConditions(): any {
    return headerArray;
  }
}
