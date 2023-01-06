import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShowfeedbackComponent } from './dialog-showfeedback.component';

describe('DialogShowfeedbackComponent', () => {
  let component: DialogShowfeedbackComponent;
  let fixture: ComponentFixture<DialogShowfeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogShowfeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogShowfeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
