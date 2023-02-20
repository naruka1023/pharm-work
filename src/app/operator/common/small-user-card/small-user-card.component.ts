import { Component, Input } from '@angular/core';
import { UserPharma } from '../../model/user.model';

@Component({
  selector: 'app-small-user-card',
  templateUrl: './small-user-card.component.html',
  styleUrls: ['./small-user-card.component.css']
})
export class SmallUserCardComponent {
  @Input()content!: UserPharma;
  @Input() type!: string;
}
