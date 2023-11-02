import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoveryComponent } from './recovery.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { of } from 'rxjs';

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

// Test de la méthode onSubmit()
  it('should set popup to true when onSubmit is called', async () => {
    component.email = 'test@example.com';

    // Mock de supa.resetPasswordBis pour renvoyer une promesse résolue
    const supaResetPasswordBisSpy = spyOn(component.supa, 'resetPasswordBis').and.returnValue(of(true).toPromise());

    await component.onSubmit();

    // Vérifiez si la valeur de popup est définie à true
    expect(component.popup).toBe(true);

    // Vérifiez que supa.resetPasswordBis a été appelé
    expect(supaResetPasswordBisSpy).toHaveBeenCalled();
  });

// Test du Regex pour l'email - simule une adresse valide et renvoie true
  it('should match valid email addresses using the email regex', () => {
    const validEmails = ['test@example.com', 'user12345@test.co', 'john.doe@example.co.uk'];   

    for (const email of validEmails) {
      expect(component.emailRegex.test(email)).toBe(true);
    }
  });

// Test du Regex pour l'email - simule une adresse invalide et renvoie false
  it('should not match invalid email addresses using the email regex', () => {
    const invalidEmails = ['notAnEmail', 'user@', '@example.com', 'test@.com'];    

    for (const email of invalidEmails) {
      expect(component.emailRegex.test(email)).toBe(false);
    }
  });
  
});









