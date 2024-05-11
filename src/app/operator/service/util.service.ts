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
  confirmAddJobSubject: Subject<boolean> = new Subject();
  leaveEditSubject: Subject<string> = new Subject();
  revertTabSubject: Subject<void> = new Subject();
  googleMapRevertSubject: Subject<void> = new Subject();
  callView: Subject<void> = new Subject();
  regulateTabSubject: Subject<string> = new Subject();
  userRequestSubject: Subject<jobUIDForUser> = new Subject();
  removeRequestSubject: Subject<jobUIDForUser> = new Subject();
  requestViewSubject: Subject<UserPharma> = new Subject();
  googleMapSubject: Subject<any> = new Subject();
  buyBannerSubject: Subject<void> = new Subject();

  getBuyBannerSubject(): Observable<any>{
    return this.buyBannerSubject.asObservable()
  }

  sendBuyBannerSubject(){
    return this.buyBannerSubject.next();
  }

  getGoogleMapSubject(): Observable<any>{
    return this.googleMapSubject.asObservable()
  }

  sendGoogleMapSubject(googleMap: any){
    return this.googleMapSubject.next(googleMap);
  }

  getRevertGoogleMapSubject(): Observable<void>{
    return this.googleMapRevertSubject.asObservable()
  }

  sendRevertGoogleMapSubject(){
    return this.googleMapRevertSubject.next();
  }

  getConfirmAddJobSubject(): Observable<boolean>{
    return this.confirmAddJobSubject.asObservable()
  }

  sendConfirmAddJobSubject(activeFlag: boolean){
    return this.confirmAddJobSubject.next(activeFlag);
  }

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
  convertUserPharmaListToArray(userPharmaList: userPharmaList): UserPharma[]{
    const keys = Object.keys(userPharmaList);
    const arrayPayload: UserPharma[] = []
    keys.forEach((key)=>{
      arrayPayload.push(userPharmaList[key])
    })
    return arrayPayload
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
  populateObjectWithUrgentLocationFields(userForm:UserPharma | UserUrgentSearchForm){
    const newUser: any = userForm;
    newUser.preferredUrgentDistrict =  userForm.preferredUrgentLocation?.District  !== undefined? userForm.preferredUrgentLocation.District: '' 
    newUser.preferredUrgentProvince =  userForm.preferredUrgentLocation?.Province  !== undefined? userForm.preferredUrgentLocation.Province: '' 
    newUser.preferredUrgentSection =  userForm.preferredUrgentLocation?.Section  !== undefined? userForm.preferredUrgentLocation.Section: '' 
    delete newUser.preferredUrgentLocation;
    return newUser;
  }
  populateUrgentLocationFieldsWithObject(userForm:UserPharma){
    userForm.preferredUrgentLocation = {
      Province: userForm.preferredUrgentProvince !== undefined? userForm.preferredUrgentProvince: '' ,
      District: userForm.preferredUrgentDistrict !== undefined? userForm.preferredUrgentDistrict: '' ,
      Section: userForm.preferredUrgentSection !== undefined? userForm.preferredUrgentSection: '' ,
    }
    delete userForm.preferredUrgentProvince;
    delete userForm.preferredUrgentDistrict;
    delete userForm.preferredUrgentSection;
    return userForm
  }
  populateObjectWithLocationFields(userForm:UserPharma | UserSearchForm){
    const newUser: any = userForm;
    newUser.preferredAddress =  userForm.preferredLocation?.address !== undefined? userForm.preferredLocation.address: ''
    newUser.preferredDistrict =  userForm.preferredLocation?.District  !== undefined? userForm.preferredLocation.District: '' 
    newUser.preferredProvince =  userForm.preferredLocation?.Province  !== undefined? userForm.preferredLocation.Province: '' 
    newUser.preferredSection =  userForm.preferredLocation?.Section  !== undefined? userForm.preferredLocation.Section: '' 
    delete newUser.preferredLocation;
    return newUser;
  }

}