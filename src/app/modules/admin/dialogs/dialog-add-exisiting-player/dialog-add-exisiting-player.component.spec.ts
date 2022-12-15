import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddExisitingPlayerComponent } from './dialog-add-exisiting-player.component';

describe('DialogAddExisitingPlayerComponent', () => {
  let component: DialogAddExisitingPlayerComponent;
  let fixture: ComponentFixture<DialogAddExisitingPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddExisitingPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddExisitingPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
