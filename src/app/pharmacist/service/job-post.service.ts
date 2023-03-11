import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as _ from 'lodash';
import { catchError, combineLatest, forkJoin, map, merge, Observable, Subject } from 'rxjs';
import headerArray from '../model/data/uiKeys';
import { Bookmark, filterConditions, Follow, jobPostModel, jobPostPayload, jobRequest, userOperator } from '../model/typescriptModel/jobPost.model';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {

  RecentlySeenSubject: Subject<void> = new Subject();
  
  constructor(private db: AngularFirestore) { }

  getRecentlySeenSubject(): Observable<void>{
    return this.RecentlySeenSubject.asObservable();
  }
  
  sendRecentlySeenSubject(){
    return this.RecentlySeenSubject.next();
  }
  
  getUserBookmark(userUID: string) {
    return this.db.collection('bookmark', ref => ref.where('userUID', '==', userUID)).get()
    .pipe(
      map((src: any)=>{
        return src.docs.map((bookmark:any)=>{
          return {
            ...bookmark.data(),
            bookmarkUID: bookmark.id
          }
        })
      })
      );
    }

  getJobFromBookmark(bookmark:Bookmark){
    return this.db.collection('job-post').doc(bookmark.jobUID).snapshotChanges().pipe(
      map((job:any)=>{
        return {
          ...bookmark,
          type: job.type,
          JobPost: {
            ...job.payload.data(),
            custom_doc_id:job.payload.id,
          }
        };
      })
    );
  }

  getListofJobFromBookmark(array:Bookmark[]){
    let newSrc = array.map((value: Bookmark)=>{ return value.jobUID});
    const reads = newSrc.map((id:string) => this.db.collection('job-post').doc(id).snapshotChanges().pipe(
      map((job:any)=>{
        let resultBookmark = array.find((originalBookmark)=>{
          return originalBookmark.jobUID == job.payload.id
        })
        return {
          ...resultBookmark,
          JobPost: {
            ...job.payload.data(),
            custom_doc_id:job.payload.id,
            type: job.type
          }
        }
      })
    ));
    let join$ = merge(reads)
    return join$    
  }
  
  getJobOfOperator(operatorUID: string): Observable<jobPostModel[]>{
    return this.db.collection('job-post', ref => ref.where('OperatorUID', '==', operatorUID)).get().pipe(
      map((jobs:any)=>{
        return jobs.docs.map((job:any)=> {
          return {
            ...job.data(),
            custom_doc_id: job.id
          } as jobPostModel
        })
      })
    )
  }

  addBookmarkService(jobUID: string, userUID: string){
    let payload: Partial<Bookmark> = {
      jobUID: jobUID,
      userUID: userUID
    }
    return this.db.collection('bookmark').add(payload)
  }

  removeBookMarkService(bookmarkID: string) {
      let newID = _.cloneDeep(bookmarkID)
      return this.db.collection('bookmark').doc(newID).delete().catch((err)=>{
        return err;
      })
  }

  getJobsFromJobRequest(jobIDList:string[]){
    const reads = jobIDList.map((id:string) => this.db.collection('job-post').doc(id).snapshotChanges().pipe(
      map((job:any)=>{
        return {
          ...job.payload.data(),
          custom_doc_id:job.payload.id,
        }
      })
    ));
    let join$ = merge(reads)
    return join$
  }

  getJobFromJobRequest(id:string){
    return this.db.collection('job-post').doc(id).snapshotChanges().pipe(
      map((job:any)=>{
        return {
          ...job.payload.data(),
          custom_doc_id:job.payload.id,
          type:job.type
        };
      })
    );
  }

  getRequestJob(userID:string){
    return this.db.collection('job-request', ref => ref.where('userUID', '==', userID)).get()
  }

  requestJob(jobID:string, operatorID:string, userID:string){
    let payload: jobRequest = {
      operatorUID: operatorID,
      userUID: userID,
      jobUID: jobID
    }
    return this.db.collection('job-request').add(payload)
  }

  cancelRequest(jobRequestUID: string){
    return this.db.collection('job-request').doc(jobRequestUID).delete();
  }

  getJobCategoryService(CategorySymbol:string) {
    return this.db.collection('job-post', ref => ref.where('Active', '==', true).where('CategorySymbol', '==', CategorySymbol)).valueChanges({ idField: 'custom_doc_id' })
    .pipe(
      map((src: any)=>{
        let res :jobPostPayload = {
          JobsPost: src,
          CategorySymbol: CategorySymbol
        }
        return res;
      }),
      catchError((err)=>{
        return err
      })
    );
  }

  followOperator(follow:Follow){
    return this.db.collection('followers').add(follow);
  }

  unfollowOperator(followUID: string) {
    let newID = _.cloneDeep(followUID)
    return this.db.collection('followers').doc(followUID).delete().catch((err)=>{
      return err;
    })
  }
  getOperatorFromFollows(operatorIDList:string[]){
    const reads = operatorIDList.map((id:string) => this.db.collection('users').doc(id).get());
    return combineLatest(reads).pipe(
      map((values: any)=>{
            let payload: any = {};
            values.forEach((value: any)=>{
              let payloadInner = value.data() as userOperator
              payload[value.id] = payloadInner
            })
            return payload
      })
    );
  }

  getFollowers(userID:string){
    return this.db.collection('followers', ref => ref.where('userUID', '==', userID)).get()
  }
  
  getAllJobPost(): Observable<filterConditions[]>{
    return this.db.collection('job-post', ref => ref.where('Active', '==', true)).valueChanges({ idField: 'custom_doc_id' }).pipe(
      map((src)=>{
        let payload: any[] = src;
        let hA : filterConditions [] = headerArray.map((header) =>{
          let filteredPayload : jobPostModel[] = payload.filter((item: jobPostModel) => {
            return (item.CategorySymbol === header.CategorySymbol)? true : false 
          })
          return {
            ...header,
            content:filteredPayload
          }
        })
        return hA;
      })
    );
  }
}
