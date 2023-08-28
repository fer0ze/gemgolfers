import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPlayerReportComponent } from './daily-player-report.component';

describe('DailyPlayerReportComponent', () => {
  let component: DailyPlayerReportComponent;
  let fixture: ComponentFixture<DailyPlayerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyPlayerReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyPlayerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
