import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPlayerScoreComponent } from './dialog-player-score.component';

describe('DialogPlayerScoreComponent', () => {
  let component: DialogPlayerScoreComponent;
  let fixture: ComponentFixture<DialogPlayerScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPlayerScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPlayerScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
