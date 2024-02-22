import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunauteComponent } from './communaute.component';

describe('CommunauteComponent', () => {
  let component: CommunauteComponent;
  let fixture: ComponentFixture<CommunauteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunauteComponent]
    });
    fixture = TestBed.createComponent(CommunauteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
