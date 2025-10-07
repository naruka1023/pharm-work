import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Bookmark, jobRequest } from '../model/typescriptModel/jobPost.model';
import { User, requestView } from '../model/typescriptModel/users.model';
import { apiKey } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  editSubject: Subject<boolean> = new Subject();
  leaveEditSubject: Subject<string> = new Subject();
  revertTabSubject: Subject<void> = new Subject();
  callView: Subject<void> = new Subject();
  listenJobRequest: Subject<jobRequest> = new Subject();
  listenJobBookmark: Subject<Bookmark> = new Subject();
  editProfileSubject: Subject<void> = new Subject();
  removeRequestSubject: Subject<string> = new Subject();
  removeBookmarkSubject: Subject<string> = new Subject();
  requestViewSubject: Subject<requestView> = new Subject()

  constructor(private http:HttpClient){}
  
  getCallView(): Observable<void>{
    return this.callView.asObservable();
  }
  

  getRequestViewSubject(): Observable<requestView>{
    return this.requestViewSubject.asObservable()
  }

  sendRequestViewSubject(user: requestView){
    return this.requestViewSubject.next(user);
  }
  
  getListenJobRequest(): Observable<jobRequest>{
    return this.listenJobRequest.asObservable();
  }
  
  getListenJobBookmark(): Observable<Bookmark>{
    return this.listenJobBookmark.asObservable();
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
  getMapAddress(lng: string, lat: string){
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + apiKey.google_map
    return this.http.get(url)
  }
  populateObjectWithUrgentLocationFields(userForm:User){
    const newUser: any = userForm;
    newUser.preferredUrgentDistrict =  userForm.preferredUrgentLocation?.District  !== undefined? userForm.preferredUrgentLocation.District: '' 
    newUser.preferredUrgentProvince =  userForm.preferredUrgentLocation?.Province  !== undefined? userForm.preferredUrgentLocation.Province: '' 
    newUser.preferredUrgentSection =  userForm.preferredUrgentLocation?.Section  !== undefined? userForm.preferredUrgentLocation.Section: '' 
    delete newUser.preferredUrgentLocation;
    return newUser;
  }
  populateUrgentLocationFieldsWithObject(userForm:User){
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
