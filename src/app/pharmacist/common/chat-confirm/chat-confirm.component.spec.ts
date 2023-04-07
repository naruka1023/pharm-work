import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatConfirmComponent } from './chat-confirm.component';

describe('ChatConfirmComponent', () => {
  let component: ChatConfirmComponent;
  let fixture: ComponentFixture<ChatConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
