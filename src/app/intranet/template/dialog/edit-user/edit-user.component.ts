import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { UtilisateurI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { UsersService } from 'src/app/partage/services/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  // @Input() email!: string;
  // @Input() nom!: string;
  // @Input() role!: string;
  // @Input() prenom!: string;
  @Input() user!:UtilisateurI;
  @Input() index!:number;
  @ViewChild('confirmDialog') confirmDialog: any;

  confirmDialogVisible = false;
  visible: boolean = false;
  utilisateur!: string;
  position: string = 'center';
  editForm!: FormGroup;
  selectedUserForEdit: UtilisateurI | null = null;
  stringRegex!: RegExp;
  numberRegex!: RegExp;
  passwordRegex!: RegExp;
  emailRegex!: RegExp;


  constructor(
    public supa: SupabaseService,
    public users: UsersService,
    private formbuilder: FormBuilder,
    private confirmationService: ConfirmationService,
  ) { }

  async ngOnInit(): Promise<void> {
    // this.users.fetchListeUtilisateurs(),
    // this.stringRegex = /^[a-zA-Z ]*$/;
    // this.passwordRegex = /^[A-Za-z0-9]{6,}$/;
    // this.numberRegex = /^[0-9]*$/;
    // this.emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // this.editForm = this.formbuilder.group({
    //   nom: ['', [Validators.required, Validators.pattern(this.stringRegex)]],
    //   prenom: ['', [Validators.required, Validators.pattern(this.stringRegex)]],
    //   email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    // });
    // if (this.email && this.nom && this.prenom && this.role) {
    //   this.editForm.patchValue({
    //     nom: this.nom,
    //     prenom: this.prenom,
    //     email: this.email,
    //   });
    // }
  }

  showDialog(user: UtilisateurI) {
    this.selectedUserForEdit = user;
    this.editForm.patchValue({
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
    });
    this.visible = true;
  }


  // Événement lorsque le formulaire est soumis
  async onSubmitForm(users: UtilisateurI){
    this.utilisateur = users.id;
    console.log('La méthode onSelect', this.utilisateur);

    this.supa
      .updateProfil(
        this.utilisateur,
        this.editForm.value
      )
      .then(() => {
        this.users.fetchAllUsersWithRoles();
      })
      .catch((error) => {
        console.log(error);
      });
  }

// 
  openConfirmDialog() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir modifier cet utilisateur ?',
      header: 'Confirmation',
      accept: () => {
        if (this.selectedUserForEdit) {
          this.onSubmitForm(this.selectedUserForEdit);
        } else {
          // Gérez le cas où this.selectedUserForEdit est null, si nécessaire.
        }
      },
      reject: () => {
        // Gérez le rejet ici si nécessaire
      }
    });
  }
  


  // Méthodes de la modal
  openModifyConfirmDialog() {
    this.confirmDialogVisible = true;
  }

  cancelModification() {
    this.confirmDialogVisible = false;
  }

  confirmModification() {
    this.confirmDialogVisible = false;
    if (this.selectedUserForEdit) {
      this.onSubmitForm(this.selectedUserForEdit);
    }
  }
  
  closeConfirmationDialog() {
    this.confirmDialogVisible = false;
  }
 
}