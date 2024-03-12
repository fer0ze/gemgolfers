import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyStarterReportComponent } from './daily-starter-report.component';

describe('DailyStarterReportComponent', () => {
  let component: DailyStarterReportComponent;
  let fixture: ComponentFixture<DailyStarterReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyStarterReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyStarterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
