import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubReportComponent } from './club-report.component';

describe('ClubReportComponent', () => {
  let component: ClubReportComponent;
  let fixture: ComponentFixture<ClubReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
