import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRoundsComponent } from './daily-rounds.component';

describe('DailyRoundsComponent', () => {
  let component: DailyRoundsComponent;
  let fixture: ComponentFixture<DailyRoundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyRoundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyRoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
