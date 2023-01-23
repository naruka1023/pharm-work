import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmaProfileComponent } from './pharma-profile.component';

describe('PharmaProfileComponent', () => {
  let component: PharmaProfileComponent;
  let fixture: ComponentFixture<PharmaProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmaProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmaProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
