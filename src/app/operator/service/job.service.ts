import { Injectable, inject } from '@angular/core';
import { JobRequestList, jobPostModel, jobRequest } from '../model/jobPost.model';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, query, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import _ from 'lodash';
import { removeUserFromRequestedJob, populateJobRequestWithUser, setRequestedJobs, toggleJobRequestLoadingFlag } from '../state/actions/job-request-actions';
import { Store } from '@ngrx/store';
import { getCreatedJobSuccess, toggleCreatedJobLoading } from '../state/actions/job-post.actions';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private db:Firestore = inject(Firestore)
  collatedList: JobRequestList = {};
  
  constructor(private store: Store, private userService:UsersService){}

  getCollatedList(){
    return this.collatedList
  }
  setCollatedList(list: any){
    this.collatedList = list
  }
  addOneJob(job:jobPostModel){
    return addDoc(collection(this.db, 'job-post'),job)
  }
  editJob(job:any){
    return updateDoc(doc(this.db, 'job-post', job.custom_doc_id), job)
  }
  toggleActive(uid: string, active:boolean){
    return updateDoc(doc(this.db, 'job-post', uid), {
      Active: !active
    })
  }
  async addMultipleJobs(job:jobPostModel){
    let jobsToAdd: jobPostModel[] = [];
    let dates: Date[] = job.DateOfJob as Date[];
    dates.forEach((date: Date)=>{
      jobsToAdd.push({
        ...job,
        DateOfJob:date.toISOString().split('T')[0] 
      })
    })
    let promises: Promise<any>[] = []

    jobsToAdd.forEach((job)=>{
      promises.push(addDoc(collection(this.db, 'job-post'), job))
    })
  
    let results = await Promise.all(promises)
    return 'success'
  }
  removeJob(jobID: string){
    return deleteDoc(doc(this.db, 'job-post', jobID))
  }

  getRequestJob(operatorID:string){
    return onSnapshot(query(collection(this.db, 'job-request'), where('operatorUID', '==', operatorID)), (jobs)=>{
      if(!jobs.empty){
        jobs.docChanges().forEach((job)=>{
          let newJob = job.doc.data() as jobRequest
          let id = job.doc.id;
          let requestedJobs: jobRequest = {
            ...newJob,
            type:job.type,
            custom_doc_id: id
          }
          if(Object.keys(requestedJobs).length !== 0){
            let keys = requestedJobs.jobUID
            let list = _.cloneDeep(this.collatedList);
            if(list[keys] === undefined){
              list[keys] = Object.create({})
              list[keys].jobRequest = {
                ...requestedJobs,
              }
              list[keys].users = Object.create({});
              list[keys].users[requestedJobs.userUID] = Object.create({})
              list[keys].flag = true
            }else{
              if(requestedJobs.type == 'removed'){
                this.store.dispatch(removeUserFromRequestedJob({jobUIDForUser:{user:list[keys]['users'][requestedJobs.userUID], jobUID: keys}}))
                delete list[keys].users[requestedJobs.userUID]
                if(Object.keys(list[keys].users).length == 0){
                  delete list[keys]
                }
              }else{
                if(!list[keys].flag){
                  this.userService.getUserFromJobRequest(requestedJobs).then((user:any)=>{
                    list = _.cloneDeep(list);
                    list[keys].users[user.uid] = user
                    this.collatedList = list;
                    this.store.dispatch(populateJobRequestWithUser({jobUIDForUser:{user: user, jobUID:keys}}))
                  })
                }
                list[keys].users[requestedJobs.userUID] = Object.create({})
              }
            }
            this.collatedList = list;
          }
          this.store.dispatch(setRequestedJobs({ jobRequest:this.collatedList }))
        })
      }else{
        this.store.dispatch(toggleJobRequestLoadingFlag())
      }
    })
  }

  getJobsCreated(operatorUID: string){
    return onSnapshot(query(collection(this.db, 'job-post'), where('OperatorUID', '==', operatorUID)), (jobs)=>{
      if(!jobs.empty){
        jobs.docChanges().forEach((a)=>{
          let data = a.doc.data() as jobPostModel;
          const id = a.doc.id;
          data = {
            ...data, 
            custom_doc_id:id
          }
          let jobs = { ...data,}
          this.store.dispatch(getCreatedJobSuccess({job:jobs, docType: a.type}));
        })
      }else{
        this.store.dispatch(toggleCreatedJobLoading());
      }
    })
  }
}
