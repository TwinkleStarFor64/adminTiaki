import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilComponent } from './profil.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SupabaseService } from 'src/app/partage/services/supabase.service';

describe('ProfilComponent', () => {
  let component: ProfilComponent;
  let fixture: ComponentFixture<ProfilComponent>;   

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilComponent],
      imports: [DialogModule,ConfirmDialogModule,ToastModule], // Les modules PrimeNG   
      providers: [SupabaseService]   
    });
    fixture = TestBed.createComponent(ProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

//---------------------- Test pour les Regex----------------------------------------
  it('should match valid strings using the string regex', () => {
    const validStrings = ['Hello', 'World', 'John Doe'];

    for (const str of validStrings) {
      expect(component.stringRegex.test(str)).toBe(true);
    }
  });

  it('should not match invalid strings using the string regex', () => {
    const invalidStrings = ['Hello1', '12345', 'Special@Character'];

    for (const str of invalidStrings) {
      expect(component.stringRegex.test(str)).toBe(false);
    }
  });

  it('should match valid numbers using the number regex', () => {
    const validNumbers = ['123', '456', '7890'];

    for (const num of validNumbers) {
      expect(component.numberRegex.test(num)).toBe(true);
    }
  });

  it('should not match invalid numbers using the number regex', () => {
    const invalidNumbers = ['abc', '12a', '1.23'];

    for (const num of invalidNumbers) {
      expect(component.numberRegex.test(num)).toBe(false);
    }
  });

  it('should match valid passwords using the password regex', () => {
    const validPasswords = ['Abc123', 'password123', 'aBcDeF123'];

    for (const password of validPasswords) {
      expect(component.passwordRegex.test(password)).toBe(true);
    }
  });

  it('should not match invalid passwords using the password regex', () => {
    const invalidPasswords = ['short', 'Invalid@', 'spaces in password'];

    for (const password of invalidPasswords) {
      expect(component.passwordRegex.test(password)).toBe(false);
    }
  });
});