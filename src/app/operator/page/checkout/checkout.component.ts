import { Component, inject } from '@angular/core';
import { addDoc, doc, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Firestore, collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { UsersService } from '../../service/users.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  userUID: string = 'default'
  // private db:Firestore = inject(Firestore)
  constructor(private userService: UsersService, private store: Store){

  }
  
  ngOnInit(){
    this.store.select((state: any)=>{
      return state.user.uid
    }).subscribe((value: any)=>{
      this.userUID = value
    })
  }

  goToCheckoutPage(lookupKey: string){
    this.userService.getCheckout(lookupKey, this.userUID)
  }
}
