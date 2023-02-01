import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router, private activatedRoute:ActivatedRoute) { }

  goToJobProfile(custom_doc_id: string, CategorySymbol: string){
    this.router.navigate(['pharma/job-post'],
    {
      relativeTo:this.activatedRoute,
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
