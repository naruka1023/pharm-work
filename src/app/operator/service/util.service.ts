import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { jobUIDForUser } from '../model/jobPost.model';
import { UserPharma, User, userPharmaList } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private db: AngularFirestore) { }
  editSubject: Subject<boolean> = new Subject();
  leaveEditSubject: Subject<string> = new Subject();
  revertTabSubject: Subject<void> = new Subject();
  callView: Subject<void> = new Subject();
  regulateTabSubject: Subject<string> = new Subject();
  userRequestSubject: Subject<jobUIDForUser> = new Subject();
  removeRequestSubject: Subject<jobUIDForUser> = new Subject();

  getCallView(): Observable<void>{
    return this.callView.asObservable();
  }
  getRegulateTabSubject(): Observable<string>{
    return this.regulateTabSubject.asObservable();
  }
  getUserRequestSubject(): Observable<jobUIDForUser>{
    return this.userRequestSubject.asObservable();
  }
  
  getRevertTabSubject(): Observable<void>{
    return this.revertTabSubject.asObservable();
  }
  

  sendRevertTabSubject(){
    return this.revertTabSubject.next();
  }
  

  sendUserRequestSubject(userList:jobUIDForUser){
    return this.userRequestSubject.next(userList);
  }
  
  
  sendCallView(){
    return this.callView.next();
  }
  sendRegulateTabSubject(url: string){
    return this.regulateTabSubject.next(url);
  }

  getLeaveEditSubject(): Observable<string>{
    return this.leaveEditSubject.asObservable();
  }
  
  sendLeaveEditSubject(url: string){
    return this.leaveEditSubject.next(url);
  }
 

  updateUser(user: Partial<User>) : Promise<void>{
     return this.db.collection("users").doc(user.uid).update(user)
  }
  getUID(uid: string): Observable<any>{
    return this.db.collection('job-post', ref=>ref.where("OperatorUID", "==", uid)).get()
  }
  updateUserJobsCoverPhoto(docs: any, coverPhotoPictureUrl: string, coverPhotoOffset: number){
    const batch = this.db.firestore.batch();
    docs.docs.forEach((doc:any)=>{
        let ref = this.db.firestore.collection('job-post').doc(doc.id)
        batch.update(ref ,{
          ...doc.data(),
          coverPhotoPictureUrl: coverPhotoPictureUrl,
          coverPhotoOffset: coverPhotoOffset,
        })
    })
    return batch.commit();
  }
  updateUserJobs(docs: any, cropProfilePictureUrl: string){
    const batch = this.db.firestore.batch();
    docs.docs.forEach((doc:any)=>{
        let ref = this.db.firestore.collection('job-post').doc(doc.id)
        batch.update(ref ,{
          ...doc.data(),
          profilePictureUrl: cropProfilePictureUrl,
        })
    })
    return batch.commit();
  }
  populateLocationFieldsWithObject(userForm:UserPharma){
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
  convertUserPharmaListToArray(userPharmaList: userPharmaList): UserPharma[]{
    let keys = Object.keys(userPharmaList);
    let arrayPayload: UserPharma[] = []
    keys.forEach((key)=>{
      arrayPayload.push(userPharmaList[key])
    })
    return arrayPayload
  }
  populateObjectWithLocationFields(userForm:UserPharma){
    let newUser: any = userForm;
    newUser.preferredAddress =  userForm.preferredLocation?.address !== undefined? userForm.preferredLocation.address: ''
    newUser.preferredDistrict =  userForm.preferredLocation?.District  !== undefined? userForm.preferredLocation.District: '' 
    newUser.preferredProvince =  userForm.preferredLocation?.Province  !== undefined? userForm.preferredLocation.Province: '' 
    newUser.preferredSection =  userForm.preferredLocation?.Section  !== undefined? userForm.preferredLocation.Section: '' 
    delete newUser.preferredLocation;
    return newUser;
  }

}