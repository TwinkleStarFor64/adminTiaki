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

//---------------------------- Test pour le formulaire ----------------------------------------
it('should validate "nom" field using the string regex', () => {
  const nomControl = component.profilForm.get('nom');

  expect(nomControl?.valid).toBeFalsy();

  nomControl?.setValue('John Doe');
  expect(nomControl?.valid).toBeTruthy();

  nomControl?.setValue('123');
  expect(nomControl?.valid).toBeFalsy();
});

it('should validate "prenom" field using the string regex', () => {
  const prenomControl = component.profilForm.get('prenom');

  expect(prenomControl?.valid).toBeFalsy();

  prenomControl?.setValue('Alice Smith');
  expect(prenomControl?.valid).toBeTruthy();

  prenomControl?.setValue('123');
  expect(prenomControl?.valid).toBeFalsy();
});

it('should validate "email" field as a valid email', () => {
  const emailControl = component.profilForm.get('email');

  expect(emailControl?.valid).toBeFalsy();

  emailControl?.setValue('test@example.com');
  expect(emailControl?.valid).toBeTruthy();

  emailControl?.setValue('invalid-email');
  expect(emailControl?.valid).toBeFalsy();
});

it('should validate "telephone" field using the number regex', () => {
  const telephoneControl = component.profilForm.get('telephone');

  expect(telephoneControl?.valid).toBeFalsy();

  telephoneControl?.setValue('1234567890');
  expect(telephoneControl?.valid).toBeTruthy();

  telephoneControl?.setValue('abc');
  expect(telephoneControl?.valid).toBeFalsy();
});

});
























/* it('should throw an error when no user data is available', async () => {
  const supaService = TestBed.inject(SupabaseService);
  spyOn(supaService, 'getLoggedInUser').and.returnValue(Promise.resolve(null));

  try {
    await component.getUserProfil();
    fail('Expected an error to be thrown');
  } catch (error) {
    expect((error as Error).message).toBe('Aucune donnée utilisateur disponible');
  }
}); */

/* it('should proceed when user data is available', async () => {
  const supaService = TestBed.inject(SupabaseService);
  const userData = { 
    app_metadata: {},
    aud: 'authenticated',
    created_at:"2023-10-25T13:55:32.936947Z",
    email: 'IronMan@avengers.com',
    id: 'a87b785-3a2c-2104-c747-3b837095df93',
    user_metadata: {},
   };
  spyOn(supaService, 'getLoggedInUser').and.returnValue(Promise.resolve(userData));
  console.log('userData:', userData.id);
// Espionner la méthode getUserProfil
spyOn(component, 'getUserProfil').and.callThrough();
  try {
    await component.getUserProfil();
    // Add your expectations here for the behavior when user data is available
    console.log('userData.id après getUserProfil', userData.id);
    expect(component.id).toBe(userData.id);
  } catch (error) {
    fail('Unexpected error: ' + (error as Error).message);
  }
}); */