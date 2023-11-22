import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ingredients'
})
export class IngredientsPipe implements PipeTransform {
  //La values est un tableau - correspond à mon tableau Ciqual
  transform(values: Array<any>, filtre: string): Array<any> {
    //Ci-dessous if pas de filtre ou longueur de filtre inférieur à 3 lettres je retourne le tableau comme par il est afficher par défaut (tout les ingrédients)
    if (!filtre || filtre.length < 3) return values;
    //Ci-dessous if pas de values ou values strictement égale à 0 je retourne un tableau vide (si aucun nom d'ingrédients n'est trouvé)
    if (!values || values.length == 0) return [];

    //Retour des données filtrées, la fonction filter renvoie un tableau d'ingrédients trouvés
    return values.filter((ingredient) => {
      if (
        ingredient.alim_nom_fr.toLowerCase().indexOf(filtre.toLowerCase()) != -1        
        //Ci-dessus j'utilise != -1 afin de vérifier qu'au moins un élément correspond au filtre
        )
        return ingredient; // Les ingrédients correspondant au nom recherché (ex: soupe afficher toutes les soupes)       
    });
  }

}
