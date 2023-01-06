import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeeTimesComponent } from './add-tee-times.component';

describe('AddTeeTimesComponent', () => {
  let component: AddTeeTimesComponent;
  let fixture: ComponentFixture<AddTeeTimesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTeeTimesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeeTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
