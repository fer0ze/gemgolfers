import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMoveFlightComponent } from './dialog-move-flight.component';

describe('DialogMoveFlightComponent', () => {
  let component: DialogMoveFlightComponent;
  let fixture: ComponentFixture<DialogMoveFlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMoveFlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMoveFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
