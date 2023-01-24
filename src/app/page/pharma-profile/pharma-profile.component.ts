import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserServiceService } from 'src/app/service/user-service.service';


@Component({
  selector: 'app-pharma-profile',
  templateUrl: './pharma-profile.component.html',
  styleUrls: ['./pharma-profile.component.css']
})
export class PharmaProfileComponent {
  constructor(private userService: UserServiceService){}
  sub: Subscription = new Subscription()
  ngOnInit(){
    this.sub.add(this.userService.getRevertTabSubject().subscribe(()=>{
      document.getElementById('profileTab')?.click();
    }));
  }

}
