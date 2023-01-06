import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPlayingCategoryComponent } from './dialog-playing-category.component';

describe('DialogPlayingCategoryComponent', () => {
  let component: DialogPlayingCategoryComponent;
  let fixture: ComponentFixture<DialogPlayingCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPlayingCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPlayingCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
