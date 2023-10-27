import { Component } from '@angular/core';
import { UsersService } from 'src/app/partage/services/users.service';

@Component({
  selector: 'app-ajout-utilisateur',
  templateUrl: './ajout-utilisateur.component.html',
  styleUrls: ['./ajout-utilisateur.component.scss']
})
export class AjoutUtilisateurComponent {
  userFormData: {
    nom: string;
    prenom: string;
    telephone: string;
    email:string;
    roles: {
      admin: boolean;
      redacteur: boolean;
      nutritionniste: boolean;
      kinesitherapeute: boolean;
      optometriste: boolean;
      autres: boolean;
    };
    password: string;
  } = {
    nom: '',
    prenom: '',
    telephone: '',
    email:'',
    roles: {
      admin: false,
      redacteur: false,
      nutritionniste: false,
      kinesitherapeute: false,
      optometriste: false,
      autres: false,
    },
    password: '',
  };
  
  
  
  constructor(private userService: UsersService) {
    
  }
  
  async onCreateUserFormSubmit() {
    try {
        const newUser = await this.userService.createUser(this.userFormData);
        console.log('Nouvel utilisateur créé :', newUser);

        // Affichez un message de réussite ou effectuez d'autres actions nécessaires.
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        // Affichez un message d'erreur ou gérez l'erreur comme nécessaire.
    }
  }
}
