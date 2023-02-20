import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobTypeConverterService } from 'src/app/pharmacist/service/job-type-converter.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  constructor(private route: ActivatedRoute, private converter:JobTypeConverterService){}
  type!: string;
  title!: string;
  ngOnInit(){
    this.type = this.route.snapshot.queryParamMap.get('type')!;
    this.title = this.converter.getTitleFromCategorySymbol(this.type);
  }
}
