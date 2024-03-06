import { Pipe, PipeTransform } from '@angular/core';
import { NutritionService } from '../intranet/nutrition/nutrition.service';
import { PlatI } from '../partage/modeles/Types';

@Pipe({
  name: 'nutrition'
})
export class NutritionPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
@Pipe({
  name: 'menus'
})
export class MenusPipe implements PipeTransform {

  //Values est un tableau qui correspond à mon tableau de Plats - J'utilise ce pipe sur la page Plats (nommée nutrition)
  transform(values: Array<any>, filtre: string): Array<any> {
    //Ci-dessous if pas de filtre ou longueur de filtre inférieur à 3 lettres je retourne le tableau comme par il est afficher par défaut (tout les plats)
    if (!filtre || filtre.length < 3) return values;
    //Ci-dessous if pas de values ou values strictement égale à 0 je retourne un tableau vide (si aucun nom de plats n'est trouvé)
    if (!values || values.length == 0) return [];

    //Retour des données filtrées, la fonction filter renvoie un tableau d'aliments trouvés
    return values.filter((plat) => {
      if (
        plat.titre.toLowerCase().indexOf(filtre.toLowerCase()) != -1
        //Ci-dessus j'utilise != -1 afin de vérifier qu'au moins un élément correspond au filtre
      )
        return plat; // Les plats correspondant au nom recherché (ex: soupe afficher toutes les soupes)       
    });
  }

}
@Pipe({
  name: 'getPlat'
})
export class GetPlatPipe implements PipeTransform {

  constructor(private nutri: NutritionService) { };

  transform(id: number, attribut: string): string | number {
    if (!id) {
      return ''
    }
    const plat = this.nutri.plats.find(plat => plat.id == +id);
    console.log("Le pipe getPlat : ", plat);
    // Vérifiez si plat existe et si plat[attribut] est de type string ou number
    if (plat && (typeof plat[attribut as keyof PlatI] === 'string' || typeof plat[attribut as keyof PlatI] === 'number')) {
      return plat[attribut as keyof PlatI] as string | number;
    }
    // Si plat[attribut] n'est pas de type string ou number, retournez une string vide
    return '';
  }
}
@Pipe({
  name: 'getIngredient' // Le nom du pipe
})
export class GetIngredientPipe implements PipeTransform {

  constructor(private nutri: NutritionService) { }; // Injection de nutrition.service pour accéder à ces données (variable ciqual dans ce cas)

  transform(id: number, attribut: string): string | number {
    //Ci-dessous if pas de values ou values strictement égale à 0 je retourne un tableau vide (si aucun nom de plats n'est trouvé)
    if (!id) {
      return ''
    }
    // Le else if servant à transformer l'id reçu en string en nombre et remplacé par +id en dessous
    /* else if(typeof id === 'string') {
      id = parseInt(id);
    } */
    // Je fais un find sur this.nutri.ciqual - ciqual de nutrition.service contenant la liste d'ingrédients ciqual
    // La condition de recherche est que la propriété alim_code de l'ingrédient doit être égale à la valeur de id
    const ingredient = this.nutri.ciqualJSON.find(ingredient => ingredient['alim_code'] == +id);
    //console.log("Le pipe getIngredient : ",id, typeof id, ingredient);
    // Return d'une condition ternaire - Si ingredient existe retourne la valeur de l'attribut Sinon retourne une string vide
    // L'attribut est passé en tant qu'argument lors de l'utilisation du pipe - {{ id | getIngredient:'alim_nom_fr' }}  dans nutrition.component.html
    // Dans ce cas, 'alim_nom_fr' serait passé en tant qu'attribut
    return ingredient ? ingredient[attribut] : '';
  };
}

@Pipe({
  name: 'nutriments'
})
export class NutrimentsPipe implements PipeTransform {

  //Values est un tableau qui correspond à mon tableau de Plats - J'utilise ce pipe sur la page Plats (nommée nutrition)
  transform(values: Array<any>, filtre: string): Array<any> {
    //Ci-dessous if pas de filtre ou longueur de filtre inférieur à 3 lettres je retourne le tableau comme par il est afficher par défaut (tout les plats)
    if (!filtre || filtre.length < 3) return values;
    //Ci-dessous if pas de values ou values strictement égale à 0 je retourne un tableau vide (si aucun nom de plats n'est trouvé)
    if (!values || values.length == 0) return [];

    //Retour des données filtrées, la fonction filter renvoie un tableau d'aliments trouvés
    return values.filter((nutriment) => {
      if (
        nutriment.titre.toLowerCase().indexOf(filtre.toLowerCase()) != -1
        //Ci-dessus j'utilise != -1 afin de vérifier qu'au moins un élément correspond au filtre
      )
        return nutriment; // Les nutriments correspondant au nom recherché (ex: soupe afficher toutes les soupes)       
    });
  }
}

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
        plat.titre.toLowerCase().indexOf(filtre.toLowerCase()) != -1        
        //Ci-dessus j'utilise != -1 afin de vérifier qu'au moins un élément correspond au filtre
        )
        return plat; // Les plats correspondant au nom recherché (ex: soupe afficher toutes les soupes)       
    });
  }

}

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

@Pipe({
  name: 'allergenes'
})
export class AllergenesPipe implements PipeTransform {
  //La values est un tableau 
  transform(values: Array<any>, filtre: string): Array<any> {
    //Ci-dessous if pas de filtre ou longueur de filtre inférieur à 3 lettres je retourne le tableau comme par il est afficher par défaut (tout les allergènes)
    if (!filtre || filtre.length < 3) return values;
    //Ci-dessous if pas de values ou values strictement égale à 0 je retourne un tableau vide (si aucun nom d'allergènes n'est trouvé)
    if (!values || values.length == 0) return [];

    //Retour des données filtrées, la fonction filter renvoie un tableau d'allergènes trouvés
    return values.filter((allergene) => {
      if (
        allergene.titre.toLowerCase().indexOf(filtre.toLowerCase()) != -1        
        //Ci-dessus j'utilise != -1 afin de vérifier qu'au moins un élément correspond au filtre
        )
        return allergene; // Les allergènes correspondant au nom recherché (ex: soupe afficher toutes les soupes)       
    });
  }
}