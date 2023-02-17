import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent {
  @Input()Location!: FormGroup
  province$!: Observable<string[]>;
  district$!: Observable<string[]>;
  section$!: Observable<string[]>;
}
