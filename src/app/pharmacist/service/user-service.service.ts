import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { requestView, requestViewList, User } from '../model/typescriptModel/users.model';
import { collection, deleteDoc, doc, Firestore, getCountFromServer, getDoc, onSnapshot, query, updateDoc, where } from '@angular/fire/firestore';
import { modifyRequestView, removeRequestView, setRequestView } from '../state/actions/request-view.actions';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private firestore: Firestore = inject(Firestore)
  
  constructor(private store: Store) { }
  leaveEditSubject: Subject<string> = new Subject();
  revertTabSubject: Subject<void> = new Subject();
  callView: Subject<void> = new Subject();
  
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

  getLeaveEditSubject(): Observable<string>{
    return this.leaveEditSubject.asObservable();
  }
  
  sendLeaveEditSubject(url: string){
    return this.leaveEditSubject.next(url);
  }

  getOperatorData(operatorUID:string){
    return getDoc(doc(this.firestore, 'users', operatorUID))
  }
  updateUser(user: Partial<User>){
    return updateDoc(doc(this.firestore, 'users', user.uid!), user)
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

  getListOfUsersFromRequestView(array:requestView[]): Promise<requestView[]>{
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
