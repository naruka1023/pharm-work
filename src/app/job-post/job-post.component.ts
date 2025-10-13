import { Component, inject } from '@angular/core';
import { jobPostModel } from '../model/user.model';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-job-post',
  templateUrl: './job-post.component.html',
  styleUrls: ['./job-post.component.css'],
})
export class JobPostComponent {
  profile!: jobPostModel;
  loadingFlag: boolean = true;
  uid: string = '';
  urgency: boolean = false;
  urgentJobs: jobPostModel[] = [];
  urgentJobsFlag: boolean = true;
  zoom: number = 15;
  breakingPoint = {
    1400: {
      slidesPerView: 4.5,
    },
    1200: {
      slidesPerView: 4,
    },
    992: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 2.5,
    },
    420: {
      slidesPerView: 1.5,
    },
  };
  none: google.maps.MapOptions = {
    gestureHandling: 'greedy',
  };
  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };
  constructor(
    private firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute
  ) {}

  private db: Firestore = this.firebaseService.firestore;

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((id) => {
      getDoc(doc(this.db, 'job-post', id.get('id')!)).then((job) => {
        this.profile = job.data() as jobPostModel;
        if (this.profile._geoloc !== undefined) {
          this.center = this.profile._geoloc;
          this.markerPosition = this.center;
        }
        this.urgency = this.profile.Urgency;
        this.loadingFlag = false;
        getDocs(
          query(
            collection(this.db, 'job-post'),
            where('Active', '==', true),
            where('OperatorUID', '==', this.profile.OperatorUID)
          )
        ).then((jobs) => {
          this.urgentJobs = jobs.docs.map((job) => {
            return { ...(job.data() as jobPostModel), custom_doc_id: job.id };
          });
          this.urgentJobsFlag = false;
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
