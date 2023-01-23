import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { jobPostModel } from 'src/app/model/typescriptModel/jobPost.model';

@Component({
  selector: 'app-job-post-details',
  templateUrl: './job-post-details.component.html',
  styleUrls: ['./job-post-details.component.css']
})
export class JobPostDetailsComponent {

  constructor(private route: ActivatedRoute, private auth: AngularFireAuth, private router: Router, private store: Store){}

  profilePayload$!:Observable<jobPostModel>;
  loading$!:Observable<boolean>;
  id!: string;
  categorySymbol!: string;
  profile!:jobPostModel

  ngOnInit(){
    this.id = this.route.snapshot.queryParamMap.get('id')!;
    this.categorySymbol = this.route.snapshot.queryParamMap.get('categorySymbol')!;
    this.loading$ = this.store.select((state: any) =>{
      return state.jobpost.loading;
    });
    this.loading$.subscribe((res)=>{
      if(res){
        this.router.navigate([''])
      }
    })
    this.profilePayload$ = this.store.select((state: any)=>{
      const categories: jobPostModel[] = state.jobpost.JobPost;
      const jobPost: any = categories.find((job)=>{
        return job.CategorySymbol == this.categorySymbol
      })

      return jobPost?.content?.find((profile: any) =>{
          return profile.custom_doc_id == this.id
      })
    })
    this.profilePayload$.subscribe((res: jobPostModel)=>{
      this.profile = res;
    })
  }

  acceptJob(){
    this.auth.user.subscribe((user)=>{
      if(user){
      }else{
        this.router.navigate(['login'])
      }
    })
  }
  
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}
