import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptoComponent } from './opto.component';

describe('OptoComponent', () => {
  let component: OptoComponent;
  let fixture: ComponentFixture<OptoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OptoComponent]
    });
    fixture = TestBed.createComponent(OptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
