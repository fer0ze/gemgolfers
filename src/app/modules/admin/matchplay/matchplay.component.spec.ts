import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchplayComponent } from './matchplay.component';

describe('MatchplayComponent', () => {
  let component: MatchplayComponent;
  let fixture: ComponentFixture<MatchplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
