import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cookie-popup',
  templateUrl: './cookie-popup.component.html',
  styleUrls: ['./cookie-popup.component.css']
})
export class CookiePopupComponent {
  cookieAccepted: boolean = false;

  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    // Check if the cookie is already set when the component initializes
    this.cookieAccepted = this.cookieService.check('cookie-accepted');
  }

  acceptCookies(): void {
    // Set a cookie to remember that the user accepted the cookies
    this.cookieService.set('cookie-accepted', 'true', 365); // Expires in 1 year
    this.cookieAccepted = true; // Hide the banner immediately
  }
}
