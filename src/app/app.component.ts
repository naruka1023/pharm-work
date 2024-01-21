import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from './model/user.model';
import { removeDefaultKey } from './state/actions/address.action';
import { setCurrentUser } from './state/actions/users.action';
import { UserService } from './service/user.service';
import { Auth, user } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUrl!:string
  constructor(private store: Store ,private route: Router, private userService:UserService) {}
  private auth: Auth = inject(Auth)  
  role!: string
  ngOnInit(){
    this.currentUrl = window.location.href;
    // let de : any = document.documentElement;
    // if (de.requestFullscreen) { de.requestFullscreen(); }
    // else if (de.mozRequestFullScreen) { de.mozRequestFullScreen(); }
    // else if (de.webkitRequestFullscreen) { de.webkitRequestFullscreen(); }
    // else if (de.msRequestFullscreen) { de.msRequestFullscreen(); }

    // // (A2) THEN LOCK ORIENTATION
    // screen.orientation.lock('portrait');
    this.store.dispatch(removeDefaultKey())
    this.store.select((state: any)=>{
      return state.user.role
    }).subscribe((role)=>{
      if(role !== '' && this.currentUrl.indexOf('landing') == -1){
        if(role == 'เภสัชกร'){
          this.route.navigate(['pharma']);
        }else{
          this.route.navigate(['operator']);
        }
      }else{
        if(this.currentUrl.indexOf('landing') == -1){
          this.route.navigate([''])
        }
      }
    })
    if(this.currentUrl.indexOf('landing') == -1){
      user(this.auth).subscribe((user)=>{
        if(user){
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
          this.route.navigate(['pharma'])
        }
      })
    }
  }

}
