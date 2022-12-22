import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GolfReportComponent } from './golf-report.component';

describe('GolfReportComponent', () => {
  let component: GolfReportComponent;
  let fixture: ComponentFixture<GolfReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GolfReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GolfReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
