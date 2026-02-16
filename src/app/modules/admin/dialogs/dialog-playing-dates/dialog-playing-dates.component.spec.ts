import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DialogPlayingDatesComponent } from "./dialog-playing-dates.component";

describe("DialogPlayingDatesComponent", () => {
  let component: DialogPlayingDatesComponent;
  let fixture: ComponentFixture<DialogPlayingDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCheckboxModule],
      declarations: [DialogPlayingDatesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPlayingDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
