import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmaHomeComponent } from './pharma-home.component';

describe('PharmaHomeComponent', () => {
  let component: PharmaHomeComponent;
  let fixture: ComponentFixture<PharmaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmaHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
