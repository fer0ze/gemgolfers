import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockWhiteComponent } from './block-white.component';

describe('BlockWhiteComponent', () => {
  let component: BlockWhiteComponent;
  let fixture: ComponentFixture<BlockWhiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockWhiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockWhiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
