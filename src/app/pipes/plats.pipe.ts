import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plats' // Le nom du pipe
})
export class PlatsPipe implements PipeTransform {
  //Values est un tableau qui correspond à mon tableau de Plats - J'utilise ce pipe sur la page Plats (nommée nutrition)
  transform(values: Array<any>, filtre: string): Array<any> {
    //Ci-dessous if pas de filtre ou longueur de filtre inférieur à 3 lettres je retourne le tableau comme par il est afficher par défaut (tout les plats)
    if (!filtre || filtre.length < 3) return values;
    //Ci-dessous if pas de values ou values strictement égale à 0 je retourne un tableau vide (si aucun nom de plats n'est trouvé)
    if (!values || values.length == 0) return [];

    //Retour des données filtrées, la fonction filter renvoie un tableau d'aliments trouvés
    return values.filter((plat) => {
      if (
        plat.nom.toLowerCase().indexOf(filtre.toLowerCase()) != -1        
        //Ci-dessus j'utilise != -1 afin de vérifier qu'au moins un élément correspond au filtre
        )
        return plat; // Les plats correspondant au nom recherché (ex: soupe afficher toutes les soupes)       
    });
  }

}
