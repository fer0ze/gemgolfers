import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedHandicapReportComponent } from './updated-handicap-report.component';

describe('UpdatedHandicapReportComponent', () => {
  let component: UpdatedHandicapReportComponent;
  let fixture: ComponentFixture<UpdatedHandicapReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatedHandicapReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedHandicapReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
