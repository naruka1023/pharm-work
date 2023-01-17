import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { filterJobs, getJobProfile, getJobs } from './state/actions/job-post.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private store: Store, private modalService: NgbModal, db: AngularFirestore) {

  }

  ngOnInit(){
  }
  

  
  dispatchProfile() {
    this.store.dispatch(getJobProfile({ id:'something' }));
  }

  
  dispatchFilter() {
    this.store.dispatch(filterJobs({ id: 'something', CategorySymbol: 'AC'}));
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
