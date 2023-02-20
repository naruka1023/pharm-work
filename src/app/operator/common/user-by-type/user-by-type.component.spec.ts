import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserByTypeComponent } from './user-by-type.component';

describe('UserByTypeComponent', () => {
  let component: UserByTypeComponent;
  let fixture: ComponentFixture<UserByTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserByTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
