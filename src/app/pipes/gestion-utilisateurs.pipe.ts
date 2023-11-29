import { Pipe, PipeTransform } from '@angular/core';
import { UtilisateurI } from '../partage/modeles/Types';

@Pipe({
  name: 'gestionUtilisateurs',
})
export class GestionUtilisateursPipe implements PipeTransform {
  transform(users:Array<UtilisateurI>, search:string='', role:string=''): any[] {
    if(search.length < 3 && role.length < 3) return users;

    search = search.toLowerCase();
    return users.filter(u => 
      role ? u.roles.includes(role) 
           : u.nom.toLowerCase().startsWith(search) 
             || u.email.toLowerCase().startsWith(search)
    );
  }
}
/** Vérifier les droits des utilisateurs pour donner des accès */
@Pipe({
  name: 'acces',
})
export class CheckAccesPipe implements PipeTransform {
  transform(role: string, userRoles: Array<string>, check?:string): boolean {
    if (!role || !userRoles) {
      return false;
    }
    return userRoles.includes(role);
  }
}
