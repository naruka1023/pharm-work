import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { RoutingService } from './service/routing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  loginFlag: boolean = false;
  constructor(private route: Router, private auth: AngularFireAuth, private modalService: NgbModal, private db: AngularFirestore) {

    this.auth.onAuthStateChanged((user)=>{
      if(user){
        this.loginFlag = true;
        localStorage.setItem('loginState', 'true')
      }else{
        this.loginFlag = false;
        localStorage.setItem('loginState', 'false')
        // this.route.navigate([''])
      }
    })
  }

  ngOnInit(){
    this.loginFlag = (localStorage.getItem('loginState') === null || localStorage.getItem('loginState') === 'false')? false: true 
  }
  signOut(){
    this.auth.signOut()
    this.route.navigate([''])
  }

  redirectToList(categorySymbol: string){
    this.route.navigate(['jobs-list'],
    {
      queryParams: 
      {
        CategorySymbol: categorySymbol,
      }
    })
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
