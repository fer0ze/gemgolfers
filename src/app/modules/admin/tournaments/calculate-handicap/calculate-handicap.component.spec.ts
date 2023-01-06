import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateHandicapComponent } from './calculate-handicap.component';

describe('CalculateHandicapComponent', () => {
  let component: CalculateHandicapComponent;
  let fixture: ComponentFixture<CalculateHandicapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculateHandicapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateHandicapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
