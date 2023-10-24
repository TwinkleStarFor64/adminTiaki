import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoveryComponent } from './recovery.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

describe('RecoveryComponent', () => {
  let component: RecoveryComponent;
  let fixture: ComponentFixture<RecoveryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecoveryComponent],
      imports: [FormsModule, ButtonModule]
    });
    fixture = TestBed.createComponent(RecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
