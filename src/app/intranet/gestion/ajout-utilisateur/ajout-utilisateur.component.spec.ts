import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutUtilisateurComponent } from './ajout-utilisateur.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';

describe('AjoutUtilisateurComponent', () => {
  let component: AjoutUtilisateurComponent;
  let fixture: ComponentFixture<AjoutUtilisateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutUtilisateurComponent],
      imports:[ButtonModule, ConfirmDialogModule,FormsModule],
      providers: [ConfirmationService],
    });
    fixture = TestBed.createComponent(AjoutUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
