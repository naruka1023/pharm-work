import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { catchError, combineLatest, forkJoin, map, Observable, of, Subject, take, zip } from 'rxjs';
import headerArray from '../model/data/uiKeys';
import { Bookmark, filterConditions, jobPostModel, jobPostPayload, jobRequest } from '../model/typescriptModel/jobPost.model';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {

  RecentlySeenSubject: Subject<void> = new Subject();
  
  constructor(private store: Store, private db: AngularFirestore) { }

  getRecentlySeenSubject(): Observable<void>{
    return this.RecentlySeenSubject.asObservable();
  }
  
  sendRecentlySeenSubject(){
    return this.RecentlySeenSubject.next();
  }
  
  getUserBookmark(userUID: string) {
    return this.db.collection('bookmark', ref => ref.where('userUID', '==', userUID)).valueChanges({ idField: 'bookmarkUID' })
    .pipe(
      map((src: any)=>{
        return src;
      })
      );
    }

  getListofJobFromBookmark(array:Bookmark[]){
    let newSrc = array.map((value: Bookmark)=>{ return value.jobUID});
    const reads = newSrc.map((id:string) => this.db.collection('job-post').doc(id).get());
    let join$ = forkJoin(reads);
    return join$.pipe(
      map((value)=>{
        return value.map((value)=>{
          let rawData: any = value.data()
          rawData['custom_doc_id'] = value.id;
          let resultBookmark = array.find((originalBookmark)=>{
            return originalBookmark.jobUID == rawData.custom_doc_id
          })
          return {
            ...resultBookmark,
            JobPost: rawData
          }
        });
      }))
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
    const reads = jobIDList.map((id:string) => this.db.collection('job-post').doc(id).snapshotChanges());
    return combineLatest(reads).pipe(
      map((value)=>{
            let payload: any = {};
            value.forEach((value)=>{
              let payloadInner = value.payload.data() as jobPostModel
              payload[value.payload.id] = {
                ...payloadInner, 
                custom_doc_id: value.payload.id
              }
            })
            return payload
      })
    );
  }

  getRequestJob(userID:string){
    return this.db.collection('job-request', ref => ref.where('userUID', '==', userID)).valueChanges({ idField: 'custom_doc_id' }).pipe()
  }

  requestJob(jobID:string, operatorID:string, userID:string){
    let payload: jobRequest = {
      operatorUID: operatorID,
      userUID: userID,
      jobUID: jobID
    }
    return this.db.collection('job-request').doc().set(payload).then(()=>{
    });
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
