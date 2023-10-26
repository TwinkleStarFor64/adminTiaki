import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { UtilisateurI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { UsersService } from 'src/app/partage/services/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  @Input() email!: string;
  @Input() nom!: string;
  @Input() telephone!: string;
  @Input() prenom!: string;
  visible: boolean = false;

  position: string = 'center';
  editForm!: FormGroup;
  selectedUserForEdit: UtilisateurI | null = null;

  stringRegex!: RegExp;
  numberRegex!: RegExp;
  passwordRegex!: RegExp;
  emailRegex!:RegExp;
  constructor(
    public supa: SupabaseService,
    public users: UsersService,
    private formbuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    
  ) {}

  async ngOnInit(): Promise<void> {
    this.supa.getLoggedInUser();
    this.stringRegex = /^[a-zA-Z ]*$/;
    this.passwordRegex = /^[A-Za-z0-9]{6,}$/;
    this.numberRegex = /^[0-9]*$/;
    this.emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.editForm = this.formbuilder.group({
      nom: ['', [Validators.required, Validators.pattern(this.stringRegex)]],
      prenom: ['', [Validators.required, Validators.pattern(this.stringRegex)]],
      telephone: ['', [Validators.required, Validators.pattern(this.numberRegex), Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    });
    if (this.email && this.nom && this.prenom && this.telephone) {
      this.editForm.patchValue({
        nom: this.nom,
        prenom:this.prenom,
        telephone:this.telephone,
        email: this.email, 
      });
    }
  }

  showDialog(user: UtilisateurI) {
    this.selectedUserForEdit = user; // Définissez la propriété selectedUserForEdit avec l'utilisateur à éditer
    this.editForm.setValue({
      nom: user.nom || '',
      prenom: user.prenom || '',
      telephone: user.telephone ? String(user.telephone) : '',
      email: user.email || '',
    });
    this.visible = true; // Affichez la boîte de dialogue
  }
  
  
  

  async onSubmitForm() {
    try {
      const userData = await this.supa.getLoggedInUser();
      if (!userData) {
        throw new Error('Aucune donnée utilisateur disponible.');
      }
  
      const userId = userData.id;
      const updatedUserData = this.editForm.value;
  
      // Appelez la méthode de mise à jour de l'utilisateur
      const update = await this.supa.updateUser(userId, updatedUserData);
  
      if (update) {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmation',
          detail: 'Modifications enregistrées',
        });
      }
  
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  }
  

  ConfirmDialog() {
    this.confirmationService.confirm({
      // Le contenu de la boîte de dialogue
      message: 'Etes vous sûr de vouloir enregistrer ces modifications ?',
      header: 'Modifier les informations personnelles',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          // Pour la pop-up
          severity: 'info',
          summary: 'Confirmation',
          detail: 'Modifications enregistrées',
        });
        console.log('Accept a été appelé');
        this.onSubmitForm(); // J'appelle la méthode d'envoie du formulaire
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              // Pour la pop-up
              severity: 'error',
              summary: 'Annuler',
              detail: 'Vous avez annuler',
            });
            console.log('Non a été cliqué, la modal sera simplement fermée.');
            window.location.reload();
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              // Pour la pop-up
              severity: 'error',
              summary: 'Annuler',
              detail: 'Vous avez annuler',
            });
            console.log('Annulation');
            window.location.reload();
            break;
        }
      },
    });
  }
}