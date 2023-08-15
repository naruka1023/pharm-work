import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { jobUIDForUser } from '../model/jobPost.model';
import { UserPharma, User, userPharmaList, UserSearchForm, UserUrgentSearchForm } from '../model/user.model';
import { DocumentData, Firestore, QuerySnapshot, collection, doc, getDocs, query, updateDoc, where, writeBatch } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private db: Firestore = inject(Firestore)
  editSubject: Subject<boolean> = new Subject();
  leaveEditSubject: Subject<string> = new Subject();
  revertTabSubject: Subject<void> = new Subject();
  callView: Subject<void> = new Subject();
  regulateTabSubject: Subject<string> = new Subject();
  userRequestSubject: Subject<jobUIDForUser> = new Subject();
  removeRequestSubject: Subject<jobUIDForUser> = new Subject();
  requestViewSubject: Subject<UserPharma> = new Subject();

  getRequestViewSubject(): Observable<UserPharma>{
    return this.requestViewSubject.asObservable()
  }

  sendRequestViewSubject(user: UserPharma){
    return this.requestViewSubject.next(user);
  }

  getCallView(): Observable<void>{
    return this.callView.asObservable();
  }
  getRegulateTabSubject(): Observable<string>{
    return this.regulateTabSubject.asObservable();
  }
  getUserRequestSubject(): Observable<jobUIDForUser>{
    return this.userRequestSubject.asObservable();
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

  updateUser(user: Partial<User>){
    return updateDoc(doc(this.db, 'users', user.uid!), user)
  }
  async updateCompanyName(companyID: string, companyName: string){
    const jobs = await this.getUID(companyID)
    const batch = writeBatch(this.db)

    jobs.docs.forEach((doc2)=>{
        batch.update(doc(this.db, 'job-post',doc2.id) ,{
          ...doc2.data(),
          Establishment: companyName,
        })
    })
    return batch.commit();
  }

  getUID(uid: string){
    return getDocs(query(collection(this.db, 'job-post'), where('OperatorUID', '==', uid)))
    
  }
  updateUserJobsCoverPhoto(docs: QuerySnapshot<DocumentData>, coverPhotoPictureUrl: string, coverPhotoOffset: number){
    
    const batch = writeBatch(this.db)

    docs.docs.forEach((doc2)=>{
        batch.update(doc(this.db, 'job-post',doc2.id) ,{
          ...doc2.data(),
          coverPhotoPictureUrl: coverPhotoPictureUrl,
          coverPhotoOffset: coverPhotoOffset,
        })
    })
    return batch.commit();
  }
  updateUserJobs(docs: QuerySnapshot<DocumentData>, cropProfilePictureUrl: string){
    const batch = writeBatch(this.db)
    docs.docs.forEach((doc2)=>{
        batch.update(doc(this.db, 'job-post', doc2.id) ,{
          ...doc2.data(),
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
    const keys = Object.keys(userPharmaList);
    const arrayPayload: UserPharma[] = []
    keys.forEach((key)=>{
      arrayPayload.push(userPharmaList[key])
    })
    return arrayPayload
  }
  populateObjectWithLocationFields(userForm:UserPharma | UserSearchForm | UserUrgentSearchForm){
    const newUser: any = userForm;
    newUser.preferredAddress =  userForm.preferredLocation?.address !== undefined? userForm.preferredLocation.address: ''
    newUser.preferredDistrict =  userForm.preferredLocation?.District  !== undefined? userForm.preferredLocation.District: '' 
    newUser.preferredProvince =  userForm.preferredLocation?.Province  !== undefined? userForm.preferredLocation.Province: '' 
    newUser.preferredSection =  userForm.preferredLocation?.Section  !== undefined? userForm.preferredLocation.Section: '' 
    delete newUser.preferredLocation;
    return newUser;
  }

}