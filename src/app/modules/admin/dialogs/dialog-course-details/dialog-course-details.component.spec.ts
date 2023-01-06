import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCourseDetailsComponent } from './dialog-course-details.component';

describe('DialogCourseDetailsComponent', () => {
  let component: DialogCourseDetailsComponent;
  let fixture: ComponentFixture<DialogCourseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCourseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
