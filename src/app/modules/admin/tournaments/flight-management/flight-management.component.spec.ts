import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightManagementComponent } from './flight-management.component';

describe('FlightManagementComponent', () => {
  let component: FlightManagementComponent;
  let fixture: ComponentFixture<FlightManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
