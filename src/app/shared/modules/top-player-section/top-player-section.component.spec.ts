import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPlayerSectionComponent } from './top-player-section.component';

describe('TopPlayerSectionComponent', () => {
  let component: TopPlayerSectionComponent;
  let fixture: ComponentFixture<TopPlayerSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopPlayerSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopPlayerSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
