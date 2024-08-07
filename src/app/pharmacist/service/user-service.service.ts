import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { aggregationCount, notificationContent, notifications, requestView, requestViewList, User } from '../model/typescriptModel/users.model';
import { addDoc, collection, deleteDoc, doc, Firestore, getCountFromServer, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { modifyRequestView, removeRequestView, setRequestView } from '../state/actions/request-view.actions';
import { url, limitBanner } from 'src/environments/environment';
import { removeNotifications, modifyNotifications, addNotifications } from '../state/actions/notifications.actions.';
import { userOperator } from '../model/typescriptModel/jobPost.model';
import { setBannersFlag } from '../state/actions/job-post.actions';
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private firestore: Firestore = inject(Firestore)
  
  constructor(private store: Store, private http: HttpClient) { }
  leaveEditSubject: Subject<string> = new Subject();
  selectTabSubject: Subject<string> = new Subject();
  callView: Subject<void> = new Subject();

  async getCountGroup(): Promise<aggregationCount>{
    const jobcount = await getCountFromServer(query(collection(this.firestore, 'job-post'), where('Active', '==', true)))
    const userPharmaCount = await getCountFromServer(query(collection(this.firestore, 'users'), where('role', '==', 'เภสัชกร')))
    const userOperatorCount = await getCountFromServer(query(collection(this.firestore, 'users'), where('role', '==', 'ผู้ประกอบการ')))
    const result = {
      jobCount: jobcount.data().count,
      userPharmaCount: userPharmaCount.data().count,
      userOperatorCount: userOperatorCount.data().count
    }
    return result
  }

  sendRequestChangeEmail(body: any){
    return this.http.post(url.sendEmail, body, {
      responseType: 'text'
    })
  }

  upgradeToPharma(operatorUID: string, license: string){
    return updateDoc(doc(this.firestore, 'users',operatorUID!), {
      studentFlag: false,
      license: license
    })
  }
  authenticateLicense(name: string = '', surname: string = '', license: string = ''){
    const params = new HttpParams().set('name', name).set('surname', surname).set('licenseID', license)
    return this.http.get(url.licenseAuthentication, {
      params:params,
    })
  }
  async getNumberOfFollowers(operatorUID: string){
    let count = await getCountFromServer(query(collection(this.firestore, 'followers'), where('operatorUID', '==', operatorUID)))
    return count.data().count
  }
  getCallView(): Observable<void>{
    return this.callView.asObservable();
  }
  sendCallView(){
    return this.callView.next();
  }

  getSelectTabSubject(): Observable<string>{
    return this.selectTabSubject.asObservable();
  }
  
  sendSelectTabSubject(target: string){
    return this.selectTabSubject.next(target);
  }

  getLeaveEditSubject(): Observable<string>{
    return this.leaveEditSubject.asObservable();
  }
  
  sendLeaveEditSubject(url: string){
    return this.leaveEditSubject.next(url);
  }

  getOperatorData(operatorUID:string){
    return getDoc(doc(this.firestore, 'users', operatorUID))
  }
  updateNotifications(notification: Partial<notificationContent>){
    return updateDoc(doc(this.firestore, 'notification-archive', notification.notificationID!), notification)
  } 
  getLimitBanner(){
    return getDocs(query(collection(this.firestore, 'banners'))).then((value: any)=>{
      let resultPayload = value.docs.map((row: any)=> row.data())
      resultPayload = resultPayload[0]
      Object.keys(resultPayload).map((key)=>{
        resultPayload[key] =  resultPayload[key].length < limitBanner[key]?false: true
      })
      this.store.dispatch(setBannersFlag({bannersFlag: resultPayload}))
    })
  }
  updateUser(user: Partial<User>){
    return updateDoc(doc(this.firestore, 'users', user.uid!), user)
  } 
  getNotifications(userUID: string){
    onSnapshot(query(collection(this.firestore, 'notification-archive'), where('userUID', '==', userUID), orderBy('dateCreatedUnix', 'desc')), (notification)=>{
      let size = notification.size
      let notificationArray: notificationContent [] = []
      return notification.docChanges().map((value)=>{
        let notificationPayload = {
          payload: {
            ...value.doc.data() as notificationContent,
            notificationID: value.doc.id
          },
          type: value.type 
        }
        switch(notificationPayload.type){
          case 'added':
            // if(notificationArray.length < size){
              notificationArray.push(notificationPayload.payload)
            // }else{
            //   let temp: notificationContent[] = [notificationPayload.payload]
            //   temp = temp.concat(notificationArray)
            //   notificationArray = temp
            // }
            break;
          case 'removed':
            this.store.dispatch(removeNotifications({notification: notificationPayload.payload}))
            break;
          case 'modified':
            this.store.dispatch(modifyNotifications({notification: notificationPayload.payload}))
            break;
        }
        if(notificationArray.length > 0){
          let finalNotificationPayload: {
            [key:string]: notificationContent
          } = {}
          notificationArray.forEach((notification)=>{
            finalNotificationPayload[notification.notificationID] = notification;
          })
          this.store.dispatch(addNotifications({notifications:finalNotificationPayload, size:size}))
        }
      })
    })
  }
  async getUser(uid: string){
    const user = await getDoc(doc(this.firestore, 'users', uid))
    const result: userOperator = {
      ...user.data() as userOperator,
      uid:uid
    }
    return result;
    
  }
  getRequestView(userUID: string){
    onSnapshot(query(collection(this.firestore, 'request-view'), where('userUID', '==', userUID)), (requestView)=>{
      return requestView.docChanges().map((value)=>{
        let requestViewArray: requestView [] = []
        let requestViewPayload = {
          payload: {
            ...value.doc.data() as requestView,
            requestViewUID: value.doc.id
          },
          type: value.type
        }
        switch(requestViewPayload.type){
          case 'added':
            requestViewArray.push(requestViewPayload.payload)
            break;
          case 'removed':
            this.store.dispatch(removeRequestView({requestView: requestViewPayload.payload}))
            break;
          case 'modified':
            this.store.dispatch(modifyRequestView({requestView:requestViewPayload.payload}))
            break;
        }
        if(requestViewArray.length !== 0){
          this.getListOfUsersFromRequestView(requestViewArray).then((populatedRequestViews: requestView[])=>{
            let requestViewListPayload: requestViewList = {}
            populatedRequestViews.forEach((requestView: requestView)=>{
              let key: string = requestView.userUID + '-' + requestView.operatorUID
              requestViewListPayload[key] = requestView
            })
          this.store.dispatch(setRequestView({requestViewList: requestViewListPayload}))
          })
        }
      })
    })
  }
  
  removeRequestView(requestViewUID: string){
    return deleteDoc(doc(this.firestore, 'request-view', requestViewUID))
  }

  confirmRequestView(requestStatus: requestView){
    return updateDoc(doc(this.firestore, 'request-view',requestStatus.requestViewUID!), {
      status: 'Accepted'
    })
  }
  confirmRequestPendingView(requestStatus: requestView){
    return updateDoc(doc(this.firestore, 'request-view',requestStatus.requestViewUID!), {
      status: 'Pending'
    })
  }

  getListOfUsersFromRequestView(array:requestView[]): Promise<requestView[]> {
    let promises: Promise<any>[] = []
    array.forEach((requestView: requestView)=>{
      promises.push(getDoc(doc(this.firestore, 'users', requestView.operatorUID)))
    })
    return Promise.all(promises).then((operators)=>{
      return operators.map((value)=>{
        let rawData: any = value.data() as requestView
        rawData['uid'] = value.id;
        let resultRequestView = array.find((originalRequestView)=>{
          return originalRequestView.operatorUID == rawData.uid
        })
        return {
          ...resultRequestView!,
          content: rawData
        }
      });
    })
  }
}
