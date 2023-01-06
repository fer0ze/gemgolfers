import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMarshalComponent } from './dialog-marshal.component';

describe('DialogMarshalComponent', () => {
  let component: DialogMarshalComponent;
  let fixture: ComponentFixture<DialogMarshalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMarshalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMarshalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
