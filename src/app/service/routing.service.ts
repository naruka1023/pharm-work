import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router) { }

  goToJobProfile(custom_doc_id: string, CategorySymbol: string){
    this.router.navigate(['job-post'],
    {
      queryParams: 
      {
        id: custom_doc_id,
        categorySymbol: CategorySymbol
      }
    })
  }
  goToPageWithLogin(url: string, loginFlag:boolean){
    this.router.navigate([url]),
    {
      queryParams:
      {
        loginFlag: loginFlag
      }
    }
  }
}
