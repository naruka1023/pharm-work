import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { forkJoin, map, Observable, of } from 'rxjs';
import { jobPostModel, jobRequest } from '../model/jobPost.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private db:AngularFirestore) { }

  addOneJob(job:jobPostModel){
    return this.db.collection('job-post').add(job);
  }
  editJob(job:jobPostModel){
    return this.db.collection('job-post').doc(job.custom_doc_id).update(job);
  }
  toggleActive(uid: string, active:boolean){
    return this.db.collection('job-post').doc(uid).update({
      Active: !active
    });
  }
  addMultipleJobs(job:jobPostModel){
    let jobsToAdd: any[] = [];
    let dates = job.DateOfJob;
    dates.forEach((date: Date)=>{
      jobsToAdd.push({
        ...job,
        DateOfJob:date.toISOString().split('T')[0]
      })
    })
    const batch = this.db.firestore.batch();
    jobsToAdd.forEach((job)=>{
      let ref = this.db.firestore.collection('job-post').doc()
      batch.set(ref ,job)
    })
  
    return batch.commit();
  }
  removeJob(jobID: string){
    return this.db.collection('job-post').doc(jobID).delete().catch((err)=>{
      return err;
    })
  }
  
  getJobsFromJobRequest(jobIDList:string[]){
    const reads = jobIDList.map((id:string) => this.db.collection('job-post').doc(id).get());
    let join$ = forkJoin(reads);
    return join$.pipe(
      map((value)=>{
        let payload: any = {}
        value.forEach((value)=>{
          let payloadInner = value.data() as jobPostModel;
          payload[value.id] = {
            ...payloadInner, 
            custom_doc_id:value.id
          }
        })
        return payload
      })
    );
  }

  getRequestJob(operatorID:string){
    return this.db.collection('job-request', ref => ref.where('operatorUID', '==', operatorID)).valueChanges({ idField: 'custom_doc_id' })
  }

  getJobsCreated(operatorUID: string):Observable<jobPostModel[]>{
    return this.db.collection('job-post', ref => ref.where('OperatorUID', '==', operatorUID)).snapshotChanges()
      .pipe(
        map((actions: any) => actions.map((a: any) => {
          let data = a.payload.doc.data() as jobPostModel;
          const id = a.payload.doc.id;
          data = {
            ...data, 
            custom_doc_id:id
          }

          return { ...data,};
        }))
      ) as unknown as Observable<jobPostModel[]>

  }
}
