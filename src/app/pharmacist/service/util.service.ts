import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { Bookmark, jobRequest } from '../model/typescriptModel/jobPost.model';
import { User, Location } from '../model/typescriptModel/users.model';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private store: Store, private db: AngularFirestore) { }
  editSubject: Subject<boolean> = new Subject();
  leaveEditSubject: Subject<string> = new Subject();
  revertTabSubject: Subject<void> = new Subject();
  callView: Subject<void> = new Subject();
  listenJobRequest: Subject<jobRequest> = new Subject();
  listenJobBookmark: Subject<Bookmark> = new Subject();
  editProfileSubject: Subject<void> = new Subject();
  removeRequestSubject: Subject<string> = new Subject();
  removeBookmarkSubject: Subject<string> = new Subject();
  
  getCallView(): Observable<void>{
    return this.callView.asObservable();
  }
  
  getListenJobRequest(): Observable<jobRequest>{
    return this.listenJobRequest.asObservable();
  }
  
  getListenJobBookmark(): Observable<Bookmark>{
    return this.listenJobBookmark.asObservable();
  }
  
  getRevertTabSubject(): Observable<void>{
    return this.revertTabSubject.asObservable();
  }
  getEditProfileSubject(): Observable<void>{
    return this.editProfileSubject.asObservable();
  }
  getRemoveRequestSubject(): Observable<string>{
    return this.removeRequestSubject.asObservable();
  }  
  getRemoveBookmarkSubject(): Observable<string>{
    return this.removeBookmarkSubject.asObservable();
  }  
  sendRemoveBookmarkSubject(jobUID: string){
    return this.removeBookmarkSubject.next(jobUID);
  }
  sendEditProfileSubject(){
    return this.editProfileSubject.next();
  }
  sendRemoveRequestSubject(jobUID:string){
    return this.removeRequestSubject.next(jobUID);
  }
  
  sendRevertTabSubject(){
    return this.revertTabSubject.next();
  }
  sendListenJobRequest(jobRequest:jobRequest){
    return this.listenJobRequest.next(jobRequest);
  }

  sendListenJobBookmark(bookmark:Bookmark){
    return this.listenJobBookmark.next(bookmark);
  }
  
  
  sendCallView(){
    return this.callView.next();
  }

  getLeaveEditSubject(): Observable<string>{
    return this.leaveEditSubject.asObservable();
  }
  
  sendLeaveEditSubject(url: string){
    return this.leaveEditSubject.next(url);
  }

  getEditSubject(): Observable<boolean>{
    return this.editSubject.asObservable();
  }
  
  sendEditSubject(){
    return this.editSubject.next(true);
  }
  updateUser(user: User) : Promise<void>{
     return this.db.collection("users").doc(user.uid).update(user)
  }
  populateLocationFieldsWithObject(userForm:User){
    userForm.preferredLocation = {
      address : userForm.preferredAddress !== undefined? userForm.preferredAddress: '' ,
      Province: userForm.preferredProvince !== undefined? userForm.preferredProvince: '' ,
      District: userForm.preferredDistrict !== undefined? userForm.preferredDistrict: '' ,
      Section: userForm.preferredSection !== undefined? userForm.preferredSection: '' ,
    }
    delete userForm.preferredAddress;
    delete userForm.preferredProvince;
    delete userForm.preferredDistrict;
    delete userForm.preferredSection;
    return userForm
  }
  populateObjectWithLocationFields(userForm:User){
    let newUser: any = userForm;
    newUser.preferredAddress =  userForm.preferredLocation?.address !== undefined? userForm.preferredLocation.address: ''
    newUser.preferredDistrict =  userForm.preferredLocation?.District  !== undefined? userForm.preferredLocation.District: '' 
    newUser.preferredProvince =  userForm.preferredLocation?.Province  !== undefined? userForm.preferredLocation.Province: '' 
    newUser.preferredSection =  userForm.preferredLocation?.Section  !== undefined? userForm.preferredLocation.Section: '' ;
    delete newUser.preferredLocation;
    return newUser;
  }
}
