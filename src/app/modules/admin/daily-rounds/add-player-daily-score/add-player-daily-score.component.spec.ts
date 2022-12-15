import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlayerDailyScoreComponent } from './add-player-daily-score.component';

describe('AddPlayerDailyScoreComponent', () => {
  let component: AddPlayerDailyScoreComponent;
  let fixture: ComponentFixture<AddPlayerDailyScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlayerDailyScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlayerDailyScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
