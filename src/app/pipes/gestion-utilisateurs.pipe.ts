import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gestionUtilisateurs',
})
export class GestionUtilisateursPipe implements PipeTransform {
  transform(values: any[], filtre: string): any[] {
    if (!filtre || filtre.length < 3) {
      return values; // Retourne le tableau non filtré si le filtre est vide ou a moins de 3 caractères.
    }
    filtre = filtre.toLowerCase(); // Convertit le filtre en minuscules pour une correspondance insensible à la casse.
    return values.filter((utilisateur) => {
      // Filtrer les utilisateurs dont le nom commence par le filtre.
      return utilisateur.nom.toLowerCase().startsWith(filtre);
    });
  }
}
/** Vérifier les droits des utilisateurs pour donner des accès */
@Pipe({
  name: 'acces',
})
export class CheckAccesPipe implements PipeTransform {
  transform(role: string, userRoles: Array<string>, check?:string): boolean {
    if (!role || !userRoles || userRoles.length == 0) {
      return false; // Retourne le tableau non filtré si le filtre est vide ou a moins de 3 caractères.
    }
    return userRoles.includes(role);
  }
}
