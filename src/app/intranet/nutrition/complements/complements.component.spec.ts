import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplementsComponent } from './complements.component';

describe('ComplementsComponent', () => {
  let component: ComplementsComponent;
  let fixture: ComponentFixture<ComplementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplementsComponent]
    });
    fixture = TestBed.createComponent(ComplementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
