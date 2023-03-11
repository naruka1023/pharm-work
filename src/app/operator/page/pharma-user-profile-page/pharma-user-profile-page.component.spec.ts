import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmaUserProfilePageComponent } from './pharma-user-profile-page.component';

describe('PharmaUserProfilePageComponent', () => {
  let component: PharmaUserProfilePageComponent;
  let fixture: ComponentFixture<PharmaUserProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmaUserProfilePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmaUserProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
