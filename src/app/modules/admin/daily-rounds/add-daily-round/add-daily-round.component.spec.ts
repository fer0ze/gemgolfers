import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDailyRoundComponent } from './add-daily-round.component';

describe('AddDailyRoundComponent', () => {
  let component: AddDailyRoundComponent;
  let fixture: ComponentFixture<AddDailyRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDailyRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDailyRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
