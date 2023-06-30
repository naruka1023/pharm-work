import { Injectable } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router, private route:ActivatedRoute) { }

  goToJobProfile(custom_doc_id: string, CategorySymbol: string, pageSrc: string){
    let queryParams = {}
    if(this.route.snapshot.queryParamMap.get('operatorExistFlag') !== null){
      let operatorUID = this.route.snapshot.queryParamMap.get('operatorUID')
      let jobType = this.route.snapshot.queryParamMap.get('jobType')
        queryParams = {
          queryParams: 
          {
            id: custom_doc_id,
            categorySymbol: CategorySymbol,
            pageSrc: pageSrc,
            jobType: jobType,
            operatorUID: operatorUID,
            operatorExistFlag: this.route.snapshot.queryParamMap.get('operatorExistFlag')
          }
        }
    }else{
      queryParams ={
        queryParams: 
        {
          id: custom_doc_id,
          categorySymbol: CategorySymbol,
          pageSrc: pageSrc
        }
      }
    }
    this.router.navigate(['pharma/job-post'], queryParams)
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
