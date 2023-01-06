import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTeeTimeSlotComponent } from './dialog-tee-time-slot.component';

describe('DialogTeeTimeSlotComponent', () => {
  let component: DialogTeeTimeSlotComponent;
  let fixture: ComponentFixture<DialogTeeTimeSlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTeeTimeSlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTeeTimeSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
