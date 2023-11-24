import { Pipe, PipeTransform } from '@angular/core';
import { UtilisateurI } from '../partage/modeles/Types';

@Pipe({
  name: 'utilisateurs',
})
export class GestionUtilisateursPipe implements PipeTransform {
  transform(users:Array<UtilisateurI>, search:string='', role:string=''): any[] {

    console.log(users, search, role)
    if(search.length < 3 && role.length < 3) return users;

    search = search.toLowerCase();
    console.log("Users filtres", users.filter(u =>u.roles.includes(role)));
    return users.filter(u => (u.nom.toLowerCase().indexOf(search) > -1 && u.email.toLowerCase().indexOf(search) > -1) || u.roles.includes(role));
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
    if (userRoles.length === 0) {
      return false;
    }
    return userRoles.includes(role);
  }
}

