import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDailyRoundComponent } from './view-daily-round.component';

describe('ViewDailyRoundComponent', () => {
  let component: ViewDailyRoundComponent;
  let fixture: ComponentFixture<ViewDailyRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDailyRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDailyRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
