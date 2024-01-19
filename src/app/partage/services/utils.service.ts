import { Injectable } from '@angular/core';
import { StatutE } from '../modeles/Types';

@Injectable({
  providedIn: 'root'
})
export class UtilsService  {
  
  excludedArrayName = 'ingredients'; //Utiliser dans flatNestedData - pour exclure le tableau 'ingredients'
  statuts: { statut: string }[] = []; 

  /**
   * Traiter les données pour écraser les 'enfants'
   * @param data {any} Des données à traiter pour enlever les enfants et renvoyer les objets sans le paramètre 'enfant'
   * @param key {string} Clé à récupérer pour écraser l'objet
   */
  flatNestedData(data: Array<any>, key: any): Array<any> {
    data.forEach(d => {
      for (let k in d) {
        if (k === this.excludedArrayName) {
          continue;
        }
        if (Array.isArray(d[k])) {
          d[k] = this.mapNestedData(d[k], key);
        }
      }
    });
    return data;
  }

  /** Traiter un tableau avec une clé à écraser
   * @param data {Array<any>} Un tableau à écraser
   * @param key {string} Une clés, généralement issue de la requête, à écraser dans le tableau
   */
  mapNestedData(data: Array<any>, key: string) {
    return data.map(d => {
      if (d.hasOwnProperty(key)) return d = d[key]
    });
  }

  convertStatut(statut: number): string {
    switch (statut) {
      case -1:
        return 'Dépublié';
      case 0:
        return 'Brouillon';
      case 1:
        return 'Publié';
      default:
        return 'Statut inconnu';
    }
  }

// Méthode pour convertir l'enum statut de sa valeur en number en string
  convertirStatutEnTexte(statut: string): string {
    switch (statut) {
      case StatutE.depublie:
        return 'Dépublié';
      case StatutE.brouillon:
        return 'Brouillon';
      case StatutE.publie:
        return 'Publié';
      default:
        return 'Statut inconnu';
    }
  }

// Méthode pour map les valeurs de l'enum StatutE
  getStatutEnum(): StatutE[] {
    return Object.values(StatutE).map(value => value as StatutE);
  }



  

}
