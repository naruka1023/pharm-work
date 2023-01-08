import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.css']
})
export class JobsListComponent {
  header!: string
  constructor(private route: ActivatedRoute){
    
  }
  ngOnInit(){
    this.header = this.route.snapshot.queryParamMap.get('header')!;
  }

}
