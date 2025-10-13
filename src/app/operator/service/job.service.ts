import { Injectable } from '@angular/core';
import {
  JobRequestList,
  jobPostModel,
  jobRequest,
} from '../model/jobPost.model';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import _, { get } from 'lodash';
import {
  setRequestedJobs,
  toggleJobRequestLoadingFlag,
  cancelRequest,
  checkIfEmptyUser,
} from '../state/actions/job-request-actions';
import { Store } from '@ngrx/store';
import {
  getCreatedJobSuccess,
  toggleCreatedJobLoading,
} from '../state/actions/job-post.actions';
import { UsersService } from './users.service';
import moment from 'moment';
import { Observable, forkJoin } from 'rxjs';
import { FirebaseService } from 'src/app/service/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(
    private store: Store,
    private userService: UsersService,
    private firebaseService: FirebaseService
  ) {}

  private db: Firestore = this.firebaseService.firestore;
  collatedList: JobRequestList = {};

  getCollatedList() {
    return this.collatedList;
  }
  setCollatedList(list: any) {
    this.collatedList = list;
  }
  async addOneJob(job: jobPostModel) {
    let newJob = await addDoc(collection(this.db, 'job-post'), job);
    if (job.Urgency) {
      this.userService
        .createRemoveUrgentJobTask(newJob.id, job.DateOfJob)
        .subscribe();
    }
    return newJob;
  }
  editJob(job: any) {
    return updateDoc(doc(this.db, 'job-post', job.custom_doc_id), job);
  }
  updateFirstNotification(jobUID: string, active: boolean) {
    return updateDoc(doc(this.db, 'job-post', jobUID), {
      Active: !active,
      dateUpdated: new Date().toISOString().split('T')[0],
      dateUpdatedUnix: Math.floor(new Date().getTime() / 1000),
      firstNotificationFlag: false,
    });
  }
  toggleActive(uid: string, active: boolean) {
    if (!active) {
      return updateDoc(doc(this.db, 'job-post', uid), {
        Active: !active,
        dateUpdated: new Date().toISOString().split('T')[0],
        dateUpdatedUnix: Math.floor(new Date().getTime() / 1000),
      });
    }
    return updateDoc(doc(this.db, 'job-post', uid), {
      Active: !active,
    });
  }
  async addMultipleJobs(job: jobPostModel) {
    let jobsToAdd: jobPostModel[] = [];
    let dates: Date[] = job.DateOfJob as Date[];
    let jobUIDtoDate = {};
    dates.forEach((date: Date) => {
      jobsToAdd.push({
        ...job,
        DateOfJob: moment(date).format('yyyy-MM-DD'),
      });
    });
    let promises: Promise<DocumentReference<DocumentData>>[] = [];
    let observables: Observable<Object>[] = [];
    jobsToAdd.forEach((job) => {
      promises.push(addDoc(collection(this.db, 'job-post'), job));
    });
    let results = await Promise.all(promises);
    results.forEach(async (result) => {
      let createdJob = await getDoc(doc(this.db, 'job-post', result.id));
      let retrievedJob = createdJob.data() as jobPostModel;
      observables.push(
        this.userService.createRemoveUrgentJobTask(
          result.id,
          retrievedJob.DateOfJob.toString()
        )
      );
      if (observables.length == promises.length) {
        forkJoin(observables).subscribe((task) => {
          console.log(task);
        });
      }
    });
    return 'success';
  }
  removeJob(jobID: string) {
    return deleteDoc(doc(this.db, 'job-post', jobID));
  }
  cancelRequest(jobRequestUID: string) {
    return deleteDoc(doc(this.db, 'job-request', jobRequestUID));
  }

  getRequestJob(operatorID: string) {
    return onSnapshot(
      query(
        collection(this.db, 'job-request'),
        where('operatorUID', '==', operatorID)
      ),
      { includeMetadataChanges: true },
      (jobs) => {
        console.log(jobs.metadata.hasPendingWrites);
        jobs.docChanges().forEach((job) => {
          let newJob = job.doc.data() as jobRequest;
          let id = job.doc.id;
          let requestedJobs: jobRequest = {
            ...newJob,
            type: job.type,
            custom_doc_id: id,
          };
          console.log(requestedJobs);
          if (Object.keys(requestedJobs).length !== 0) {
            let keys = requestedJobs.jobUID;
            let list = _.cloneDeep(this.collatedList);
            if (list[keys] === undefined) {
              if (requestedJobs.type !== 'removed') {
                list[keys] = Object.create({});
                list[keys].jobRequest = {
                  ...requestedJobs,
                };
                list[keys].users = Object.create({});
                list[keys].users[
                  requestedJobs.custom_doc_id! + '-' + requestedJobs.userUID
                ] = Object.create({});
                list[keys].flag = true;
                console.log(
                  list[keys].users[
                    requestedJobs.custom_doc_id! + '-' + requestedJobs.userUID
                  ]
                );
              }
            } else {
              if (requestedJobs.type == 'removed') {
                this.store.dispatch(
                  cancelRequest({
                    requestUID: requestedJobs.custom_doc_id!,
                    userUID: requestedJobs.userUID,
                    jobUID: keys,
                  })
                );
                this.store.dispatch(checkIfEmptyUser({ jobUID: keys! }));
                delete list[keys].users[
                  requestedJobs.custom_doc_id! + '-' + requestedJobs.userUID
                ];
                if (Object.keys(list[keys].users).length == 0) {
                  delete list[keys];
                }
                this.collatedList = list;
              } else {
                if (!list[keys].flag) {
                  if (
                    list[keys].users[
                      requestedJobs.custom_doc_id! + '-' + requestedJobs.userUID
                    ] == undefined
                  ) {
                    list[keys].users[
                      requestedJobs.custom_doc_id! + '-' + requestedJobs.userUID
                    ] = { something: 'nothing' } as any;
                    this.userService
                      .getUserFromJobRequest(requestedJobs)
                      .then((user) => {
                        list = _.cloneDeep(list);
                        list[keys].users[
                          requestedJobs.custom_doc_id! +
                            '-' +
                            requestedJobs.userUID
                        ] = user;
                        this.collatedList = list;
                        console.log(list[keys].users);
                        this.store.dispatch(
                          setRequestedJobs({ jobRequest: this.collatedList })
                        );
                      });
                  }
                } else {
                  list[keys].users[
                    requestedJobs.custom_doc_id! + '-' + requestedJobs.userUID
                  ] = Object.create({});
                }
              }
            }
            this.collatedList = list;
          }
          this.store.dispatch(
            setRequestedJobs({ jobRequest: this.collatedList })
          );
        });
        if (!jobs.empty) {
        } else {
          this.store.dispatch(toggleJobRequestLoadingFlag());
        }
      }
    );
  }

  getJobsCreated(operatorUID: string) {
    return onSnapshot(
      query(
        collection(this.db, 'job-post'),
        where('OperatorUID', '==', operatorUID),
        orderBy('dateUpdatedUnix', 'desc')
      ),
      (jobs) => {
        jobs.docChanges().forEach((a) => {
          let data = a.doc.data() as jobPostModel;
          const id = a.doc.id;
          data = {
            ...data,
            custom_doc_id: id,
          };
          let jobs = { ...data };
          this.store.dispatch(
            getCreatedJobSuccess({ job: jobs, docType: a.type })
          );
        });
        if (jobs.empty) {
          this.store.dispatch(toggleCreatedJobLoading());
        }
      }
    );
  }
}
