import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammesKineComponent } from './programmes-kine.component';

describe('ProgrammesKineComponent', () => {
  let component: ProgrammesKineComponent;
  let fixture: ComponentFixture<ProgrammesKineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgrammesKineComponent]
    });
    fixture = TestBed.createComponent(ProgrammesKineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
