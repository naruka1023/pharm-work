import { Injectable } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router) { }

  goToJobProfile(custom_doc_id: string, CategorySymbol: string, activatedRoute:ActivatedRoute){
    this.router.navigate(['pharma/job-post'],
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
