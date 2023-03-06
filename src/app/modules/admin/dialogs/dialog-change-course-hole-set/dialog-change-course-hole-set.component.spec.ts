import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangeCourseHoleSetComponent } from './dialog-change-course-hole-set.component';

describe('DialogChangeCourseHoleSetComponent', () => {
  let component: DialogChangeCourseHoleSetComponent;
  let fixture: ComponentFixture<DialogChangeCourseHoleSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogChangeCourseHoleSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogChangeCourseHoleSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
