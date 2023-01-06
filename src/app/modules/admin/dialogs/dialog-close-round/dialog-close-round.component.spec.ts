import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCloseRoundComponent } from './dialog-close-round.component';

describe('DialogCloseRoundComponent', () => {
  let component: DialogCloseRoundComponent;
  let fixture: ComponentFixture<DialogCloseRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCloseRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCloseRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
