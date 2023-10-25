import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetComponent } from './reset.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

describe('ResetComponent', () => {
  let component: ResetComponent;
  let fixture: ComponentFixture<ResetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetComponent],
      imports: [FormsModule,ButtonModule]
    });
    fixture = TestBed.createComponent(ResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
