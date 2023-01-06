import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogClubScheduleComponent } from './dialog-club-schedule.component';

describe('DialogClubScheduleComponent', () => {
  let component: DialogClubScheduleComponent;
  let fixture: ComponentFixture<DialogClubScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogClubScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogClubScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
