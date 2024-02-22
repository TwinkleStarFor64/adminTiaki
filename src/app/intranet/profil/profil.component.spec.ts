import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilComponent } from './profil.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { FormsModule } from '@angular/forms';

describe('ProfilComponent', () => {
  let component: ProfilComponent;
  let fixture: ComponentFixture<ProfilComponent>;   

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilComponent],
      imports: [DialogModule,ConfirmDialogModule,ToastModule,FormsModule], // Les modules PrimeNG entre autres   
      providers: [SupabaseService]   
    });
    fixture = TestBed.createComponent(ProfilComponent);
    component = fixture.componentInstance;

  // Initialise this.users.profil avec des données simulées - Pour éviter une erreur de test échoué
  component.users.profil = {
    id: '1',
    nom: 'John Doe',
    prenom: 'John',
    telephone: '1234567890',
    roles: ['admin'],
    email: "toto@wanadoo.fr"
  };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});