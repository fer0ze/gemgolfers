import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsDilogueComponent } from './user-details-dilogue.component';

describe('UserDetailsDilogueComponent', () => {
  let component: UserDetailsDilogueComponent;
  let fixture: ComponentFixture<UserDetailsDilogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailsDilogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsDilogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
