import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandicapCalculationWhsComponent } from './handicap-calculation-whs.component';

describe('HandicapCalculationWhsComponent', () => {
  let component: HandicapCalculationWhsComponent;
  let fixture: ComponentFixture<HandicapCalculationWhsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandicapCalculationWhsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandicapCalculationWhsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
