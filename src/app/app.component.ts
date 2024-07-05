import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from './model/user.model';
import { removeDefaultKey } from './state/actions/address.action';
import { setCurrentUser } from './state/actions/users.action';
import { UserService } from './service/user.service';
import { Auth, user } from '@angular/fire/auth';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { Firestore, addDoc, collection, doc, getDocs, query, where } from '@angular/fire/firestore';
import { vapidKey } from 'src/environments/environment';
import { updateDoc } from 'firebase/firestore';
import { StringNullableChain } from 'lodash';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUrl!:string
  private _messaging = inject(Messaging);
  constructor(private store: Store ,private route: Router, private userService:UserService) {}
  private auth: Auth = inject(Auth)  
  private db: Firestore = inject(Firestore)
  clickHandler!: any
  userUID: string = ''
  role!: string
  vapidKey: string = vapidKey
  ngOnInit(){
// Add the public key generated from the console here.

    
    this.currentUrl = window.location.href;
    console.log(window.location)
    // let de : any = document.documentElement;
    // if (de.requestFullscreen) { de.requestFullscreen(); }
    // else if (de.mozRequestFullScreen) { de.mozRequestFullScreen(); }
    // else if (de.webkitRequestFullscreen) { de.webkitRequestFullscreen(); }
    // else if (de.msRequestFullscreen) { de.msRequestFullscreen(); }

    // // (A2) THEN LOCK ORIENTATION
    // screen.orientation.lock('portrait');
    console.log(navigator.userAgent)
    this.store.dispatch(removeDefaultKey())
    this.store.select((state: any)=>{
      return state.user.role
    }).subscribe((role)=>{
      if(role !== ''){
        const notificationFlag = this.currentUrl.indexOf('/notifications?') !== -1
        const successCheckoutFlag = this.currentUrl.indexOf('/success-checkout') !== -1
        const cancelCheckoutFlag = this.currentUrl.indexOf('/cancel-checkout') !== -1
        const url = notificationFlag? this.currentUrl.split('?')[1]: 'empty'
        if(role == 'เภสัชกร'){
          this.route.navigate(['pharma'],{
            queryParams: 
            { 
              notificationsFlag: notificationFlag,
              url: url
            }
          });
        }else{
          this.route.navigate(['operator'],{
            queryParams: 
            { 
              successCheckoutFlag: successCheckoutFlag,
              cancelCheckoutFlag: cancelCheckoutFlag,
              notificationsFlag: notificationFlag,
              url: url
            }
          });
        }
      }else{
        if(this.currentUrl.indexOf('notifications')  == -1 && this.currentUrl.indexOf('success-checkout')  == -1 && this.currentUrl.indexOf('cancel-checkout')  == -1){
          this.route.navigate([''])
        }
      }
    })
    user(this.auth).subscribe((user)=>{
      if(user){
          this.userUID = user.uid
          const bool = true
          if(bool){
            this.userService.getUser(user.uid).then((user)=>{
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position)=>{
                  const _geoLoc = {
                      lng: position.coords.longitude,
                      lat: position.coords.latitude
                  }
                  this.store.dispatch(setCurrentUser({
                    user:{
                      ...user,
                      _geolocCurrent: _geoLoc, 
                    }
                  }))
                }, (err) => {
                  console.warn(`ERROR(${err.code}): ${err.message}`);
                },{
                  enableHighAccuracy: true,
                  timeout:10 * 1000 * 1000,
                  maximumAge: 0
                });
              }
              this.store.dispatch(setCurrentUser({
                user:{
                  ...user,
                  coverPhotoFlag: true
                }
              }))
            })
          }else{
            const emptyUser: User = {
              role: '',
              email: '',
              uid: '',
              license: '',
              name: '',
              surname: '',
              showProfileFlag: true,
              loading: true,
              AmountCompleted: 0,
              urgentTimeFrame: '',
              urgentPreferredDay: [],
              preferredUrgentLocation: {
                Province: "",
                District: "",
                Section: ""
              },
              urgentDescription: '',
              introText: '',
              WorkExperience: 0,
              yearFlag: true,
              nickName: '',
              coverPhotoFlag: true,
              highestEducation: '',
              dateUpdated: ''
            };
            this.store.dispatch(setCurrentUser({user: emptyUser}));
            this.route.navigate(['confirm'], {
              queryParams:{
                email: this.auth.currentUser?.email
              }
            })
          }
          if(!this.clickHandler){
            this.clickHandler = this.requestPermission.bind(this);
          }
          document.addEventListener('click', this.clickHandler)
          localStorage.setItem('loginState', 'true')
      }else{
        const emptyUser: User = {
          role: '',
          email: '',
          uid: '',
          license: '',
          urgentTimeFrame: '',
          urgentPreferredDay: [],
          preferredUrgentLocation: {
            Province: "",
            District: "",
            Section: ""
          },
          urgentDescription: '',
          name: '',
          surname: '',
          showProfileFlag: true,
          loading: true,
          AmountCompleted: 0,
          introText: '',
          WorkExperience: 0,
          yearFlag: true,
          nickName: '',
          coverPhotoFlag: true,
          highestEducation: '',
          dateUpdated: ''
        };
        this.store.dispatch(setCurrentUser({user: emptyUser}));
        localStorage.setItem('loginState', 'false')
        const landingFlag = this.currentUrl.indexOf('/register') !== -1
        let registerType = ''
        if(landingFlag){
          registerType = this.currentUrl.split('/register/')[1]
          this.route.navigate(['pharma'],{
            queryParams: 
            { 
              landingFlag: landingFlag,
              registerType: registerType
            }}
          )
        }else{
          this.route.navigate(['pharma'])
        }
      }
    })
  }
  requestPermission (uid: any) {
    document.removeEventListener('click', this.clickHandler)
    window.Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        getToken(this._messaging, {vapidKey: this.vapidKey}).then((currentToken) => {
          if (currentToken) {
            getDocs(query(collection(this.db, "notification-token"), where('notificationToken', '==' , currentToken), where ('userUID', '==', uid))).then((users)=>{
              if(users.empty){
                addDoc(collection(this.db, "notification-token"), {
                  userUID: this.userUID,
                  notificationToken: currentToken
                })
              }
            })
          } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
            getToken(this._messaging, {vapidKey: this.vapidKey}).then((currentToken) => {
              if (currentToken) {
                getDocs(query(collection(this.db, "notification-token"), where('notificationToken', '==' , currentToken), where ('userUID', '==', this.userUID))).then((users)=>{
                  if(users.empty){
                    addDoc(collection(this.db, "notification-token"), {
                      userUID: this.userUID,
                      notificationToken: currentToken
                    })
                  }
                })
              } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
                // ...
              }
            })
        });
        console.log('Notification permission granted.');
      }
    })
}

}


