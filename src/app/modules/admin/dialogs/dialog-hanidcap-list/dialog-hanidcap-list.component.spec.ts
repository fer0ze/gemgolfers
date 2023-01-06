import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHanidcapListComponent } from './dialog-hanidcap-list.component';

describe('DialogHanidcapListComponent', () => {
  let component: DialogHanidcapListComponent;
  let fixture: ComponentFixture<DialogHanidcapListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogHanidcapListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHanidcapListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
