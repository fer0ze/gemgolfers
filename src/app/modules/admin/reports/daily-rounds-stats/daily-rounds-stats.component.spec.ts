import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRoundsStatsComponent } from './daily-rounds-stats.component';

describe('DailyRoundsStatsComponent', () => {
  let component: DailyRoundsStatsComponent;
  let fixture: ComponentFixture<DailyRoundsStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyRoundsStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyRoundsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
