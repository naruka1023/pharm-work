import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var bootstrap: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  loginFlag: boolean = false;
  constructor(private route: Router, private auth: AngularFireAuth, private modalService: NgbModal) {

  }
  
  ngOnInit(){
    
    this.auth.onAuthStateChanged((user)=>{
      if(user){
        this.loginFlag = true;
        localStorage.setItem('loginState', 'true')
        let tooltipTriggerList = [].slice.call(document.querySelectorAll('navbar-collapse navbar-nav || nav-item nav-link [data-bs-toggle="tooltip"]'))
        let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl)
        })
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
    this.route.navigate([''])
  }

  redirectToList(categorySymbol: string){
    this.auth.user.subscribe((user) =>{
      if(user){
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
