import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerProfileComponent } from './inner-profile.component';

describe('InnerProfileComponent', () => {
  let component: InnerProfileComponent;
  let fixture: ComponentFixture<InnerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InnerProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
