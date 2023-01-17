import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import headerArray from '../model/data/uiKeys';
import { filterConditions, jobPostModel, jobPostPayload } from '../model/typescriptModel/job-post-model/jobPost.model';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {

  constructor( private db: AngularFirestore) { }

  getAllJobPost(): Observable<filterConditions[]>{
    return this.db.collection('job-post').valueChanges({ idField: 'custom_doc_id' }).pipe(
      map((src)=>{
        let payload: any[] = src;
        let hA : filterConditions [] = headerArray.map((header) =>{
          let filteredPayload = payload.filter((item: jobPostModel) => {
            return (item.CategorySymbol === header.categorySymbol)? true : false 
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
