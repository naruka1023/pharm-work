import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';
import { UserServiceService } from '../../service/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterJobsComponent } from './register-jobs/register-jobs.component';

declare let window: any;

@Component({
  selector: 'app-pharma-profile',
  templateUrl: './pharma-profile.component.html',
  styleUrls: ['./pharma-profile.component.css'],
})
export class PharmaProfileComponent implements OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserServiceService,
    private router: Router,
    private store: Store,
    private registerJobsComponent: RegisterJobsComponent
  ) {}
  sub: Subscription = new Subscription();
  formModal!: any;
  selectChildTab: boolean = false;
  ngOnInit() {
    this.sub.add(
      this.store
        .select((state: any) => {
          return state.pharmaProfile.url !== '' ? state.pharmaProfile.url : '';
        })
        .pipe(take(1))
        .subscribe((url: string) => {
          document.getElementById(url)?.click();
        })
    );
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModalPharma')
    );
    // this.sub.add(this.userService.getCallView().pipe().subscribe(()=>{
    //   this.openFormModal();
    // }))
  }
  setChildFlag(flag: boolean) {
    this.selectChildTab = flag;
  }
  ngAfterViewInit() {
    this.activatedRoute.data.subscribe((url: any) => {
      if (url.scrollFlag) {
        setTimeout(() => {
          document.getElementById('navToScroll')!.scrollIntoView();
        }, 700);
      } else {
        this.scrollUp();
      }
      if (url.target.indexOf('?') == -1) {
        this.selectTab(url.target);
      }
    });
  }
  selectTab(target: string) {
    let newTarget = target;
    if (target == 'request-jobs' || target == 'request-views') {
      newTarget = 'register-jobs';
    }
    if (target == 'request-jobs' || target == 'request-views') {
      this.setChildFlag(true);
    } else {
      this.setChildFlag(false);
    }
    const triggerEl = document.getElementById(newTarget)!;
    triggerEl.click();
    if (this.selectChildTab) {
      if (target == 'request-jobs' || target == 'request-views') {
        this.registerJobsComponent.selectTab(target);
      }
    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  openFormModal() {
    this.formModal.show();
  }
  scrollUp() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }
}
