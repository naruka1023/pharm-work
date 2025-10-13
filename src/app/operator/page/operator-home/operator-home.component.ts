import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-operator-home',
  templateUrl: './operator-home.component.html',
  styleUrls: ['./operator-home.component.css'],
})
export class OperatorHomeComponent {
  type!: string;
  userUID!: string;

  constructor(private route: Router, private activatedRoute: ActivatedRoute) {}
  ngOnInit() {
    this.type = localStorage.getItem('type')!;
    this.userUID = localStorage.getItem('userUID')!;
    if (this.type !== null) {
      this.route.navigate(['notifications'], {
        relativeTo: this.activatedRoute,
        queryParams: {
          userUID: this.userUID,
          type: this.type,
        },
      });
    }
  }
}
