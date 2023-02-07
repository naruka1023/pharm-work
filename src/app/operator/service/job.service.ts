import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, of } from 'rxjs';
import { jobPostModel } from '../model/jobPost.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private db:AngularFirestore) { }

  addOneJob(job:jobPostModel){
    return this.db.collection('job-post').add(job);
  }
  addMultipleJobs(job:jobPostModel){
    let jobsToAdd: any[] = [];
    let dates = job.DateOfJob;
    dates.forEach((date: Date)=>{
      jobsToAdd.push({
        ...job,
        DateOfJob:[date.toISOString().split('T')[0]]
      })
    })
    jobsToAdd = jobsToAdd.map((job:any)=>{ this.db.collection('job-post').add(job)})
    const results = Promise.all(jobsToAdd)
    return results;
  }
  removeJob(jobID: string){

    return this.db.collection('job-post').doc(jobID).delete().catch((err)=>{
      console.log(err);
      return err;
    })
  }
  getJobsCreated(operatorUID: string):Observable<jobPostModel[]>{
    return this.db.collection('job-post', ref => ref.where('OperatorUID', '==', operatorUID)).snapshotChanges()
      .pipe(
        map((actions: any) => actions.map((a: any) => {
          const data = a.payload.doc.data() as jobPostModel;
          const id = a.payload.doc.id;
          return { id, ...data,};
        }))
      ) as unknown as Observable<jobPostModel[]>

  }
}
