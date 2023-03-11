import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlySeenUsersComponent } from './recently-seen-users.component';

describe('RecentlySeenUsersComponent', () => {
  let component: RecentlySeenUsersComponent;
  let fixture: ComponentFixture<RecentlySeenUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentlySeenUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlySeenUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
