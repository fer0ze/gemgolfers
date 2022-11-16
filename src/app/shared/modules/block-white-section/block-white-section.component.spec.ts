import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockWhiteSectionComponent } from './block-white-section.component';

describe('BlockWhiteSectionComponent', () => {
  let component: BlockWhiteSectionComponent;
  let fixture: ComponentFixture<BlockWhiteSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockWhiteSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockWhiteSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
