import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { of, Subscription, switchMap } from 'rxjs';
import { UserServiceService } from './service/user-service.service';
import { removeCurrentUser } from './state/actions/users.action';
declare var bootstrap: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  loginFlag: boolean = false;
  subject!: Subscription;
  constructor(private store: Store ,private userService: UserServiceService,private route: Router, private auth: AngularFireAuth, private db: AngularFirestore, private modalService: NgbModal) {

  }
  
  ngOnInit(){
    
    this.auth.user.subscribe((user)=>{
      if(user){
        this.db.collection("users").doc(user.uid).valueChanges().pipe(
          switchMap((src: any)=>{
              this.userService.passUserData(src.role, src)
            return of(src);
         })
        ).subscribe((src)=>{
          console.log(src);
        })
        this.loginFlag = true;
        localStorage.setItem('loginState', 'true')
      }else{
        this.loginFlag = false;
        localStorage.setItem('loginState', 'false')
        this.route.navigate([''])
      }
    })
    this.loginFlag = (localStorage.getItem('loginState') === null || localStorage.getItem('loginState') === 'false')? false: true 
  }
  signOut(){
    this.auth.signOut()
    this.store.dispatch(removeCurrentUser());
    this.route.navigate([''])
  }

  redirectToList(categorySymbol: string){
    if(localStorage.getItem('loginState') == 'true'){
      this.route.navigate(['jobs-list'],
      {
        queryParams: 
        {
          CategorySymbol: categorySymbol,
        }
      })
    }else{
      this.route.navigate(['login'])
    }
  }

  onActivate() {
    // window.scroll(0,0);
 
    window.scroll({ 
            top: 0, 
            left: 0, 
            behavior:"auto"
     });
 }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

}
