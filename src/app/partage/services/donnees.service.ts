import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsideI } from '../modeles/Types';

@Injectable({
  providedIn: 'root'
})
export class DonneesService {
  aside: AsideI[] = []; // Je déclare ici un tableau vide

  constructor(private http: HttpClient) { }

// Méthode pour remplir l'asideBar - récupére les données sur un tableau Json  
  getAsideBar() {
    // Après le get je déclare un tableau comme pour la variable ligne 9
    this.http.get<AsideI[]>('assets/data/navBar.json').subscribe(
      // Je récupére mon tableau Json et j'y subscribe
      {
        next: (r) => (this.aside = r), // Variable Aside ligne 9
        error: (err) => console.log(err), // Si une erreur
        complete: () => {},
        //console.log("Méthode getAsideBar : ", this.aside) // A mettre dans complete si besoin        
      }
    );
    return this.aside;
  }

}
