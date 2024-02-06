import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeOptoComponent } from './programme-opto.component';

describe('ProgrammeOptoComponent', () => {
  let component: ProgrammeOptoComponent;
  let fixture: ComponentFixture<ProgrammeOptoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgrammeOptoComponent]
    });
    fixture = TestBed.createComponent(ProgrammeOptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
