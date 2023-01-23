import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import headerArray from '../model/data/uiKeys';
import { filterConditions, jobPostModel, jobPostPayload } from '../model/typescriptModel/jobPost.model';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {
  
  constructor( private db: AngularFirestore) { }
  getJobCategoryService(CategorySymbol:string) {
    return this.db.collection('job-post', ref => ref.where('CategorySymbol', '==', CategorySymbol)).valueChanges({ idField: 'custom_doc_id' })
    .pipe(
      map((src)=>{
        let res = {
          JobsPost: src,
          CategorySymbol: CategorySymbol
        }
        return res;
      })
    );
  }

  getAllJobPost(): Observable<filterConditions[]>{
    return this.db.collection('job-post').valueChanges({ idField: 'custom_doc_id' }).pipe(
      map((src)=>{
        let payload: any[] = src;
        let hA : filterConditions [] = headerArray.map((header) =>{
          let filteredPayload : jobPostModel[] = payload.filter((item: jobPostModel) => {
            return (item.CategorySymbol === header.CategorySymbol)? true : false 
          })
          return {
            ...header,
            content:filteredPayload,
            allContent: []
          }
        })
        return hA;
      })
    );
  }
}
