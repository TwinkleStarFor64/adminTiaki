import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilisateurI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { UsersService } from 'src/app/partage/services/users.service';

@Component({
  selector: 'app-donnees-medicales',
  templateUrl: './donnees-medicales.component.html',
  styleUrls: ['./donnees-medicales.component.scss']
})
export class DonneesMedicalesComponent {
  @Input() email!: string;
  @Input() nom!: string;
  @Input() telephone!: string;
  @Input() prenom!: string;
  medForm!: FormGroup;
  selectedUserForWatch: UtilisateurI | null = null;
  visible: boolean = false;

  constructor(
    public supa: SupabaseService,
    public users: UsersService,  
    private formBuilder : FormBuilder  
  ) {

  }
  async ngOnInit(): Promise<void> {
    this.supa.getLoggedInUser();
    this.medForm = this.formBuilder.group({
      nom: [''],
      prenom: [''],
      telephone: [''],
      email: [''],
    });
    if (this.email && this.nom && this.prenom && this.telephone) {
      this.medForm.patchValue({
        nom: this.nom,
        prenom:this.prenom,
        telephone:this.telephone,
        email: this.email, 
      });
    }
    
  }

  showDialog(user: UtilisateurI) {
    this.selectedUserForWatch = user; // Définissez la propriété selectedUserForEdit avec l'utilisateur à éditer
    this.medForm.setValue({
      nom: user.nom || '',
      prenom: user.prenom || '',
      telephone: user.telephone ? String(user.telephone) : '',
      email: user.email || '',
    });
    this.visible = true; // Affichez la boîte de dialogue
  }
}
