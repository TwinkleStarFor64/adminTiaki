import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { UtilisateursComponent } from './utilisateurs.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckAccesPipe, GestionUtilisateursPipe } from 'src/app/pipes/gestion-utilisateurs.pipe';

// Stub for app-delete-data
@Component({
  selector: 'app-delete-data',
  template: ''
})

class DeleteDataStubComponent {}

describe('UtilisateursComponent', () => {
  let component: UtilisateursComponent;
  let fixture: ComponentFixture<UtilisateursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UtilisateursComponent,
        GestionUtilisateursPipe,
        DeleteDataStubComponent // Declare the stub here
      ],
      imports: [ConfirmDialogModule,FormsModule,ReactiveFormsModule],
      providers: [ConfirmationService,GestionUtilisateursPipe,CheckAccesPipe],
    });
    fixture = TestBed.createComponent(UtilisateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});