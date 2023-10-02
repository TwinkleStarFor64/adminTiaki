import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

//La méthode setToken() est utilisée pour stocker le token d'authentification dans le stockage local du navigateur. 
//Elle prend en paramètre un token sous forme de chaîne de caractères et utilise la méthode setItem() de localStorage pour stocker le token sous le nom "token". 
//Le stockage local est un espace de stockage dans le navigateur qui persiste même lorsque le navigateur est fermé ou redémarré.
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

//La méthode getToken() est utilisée pour récupérer le token d'authentification stocké dans le stockage local du navigateur.
//Elle utilise la méthode getItem() de localStorage pour récupérer le token stocké sous le nom "token". 
//Si le token est présent dans le stockage local, la méthode le renvoie sous forme de chaîne de caractères. Sinon, elle renvoie null.
  getToken(): string | null { // String ou null - symbole |
    return localStorage.getItem('token');
  }

// Ci-dessous je vérifie que le token n'est pas null - appelle de getToken()
  isLoggedIn() {
    return this.getToken() !== null;
  }

// Je déconnecte et je remove le token puis je renvoie à la page login  
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['connexion']);
  }

// Je subscribe à la méthode login() dans login.component.ts via la méthode onSubmitForm
  login({ email, password }: any): Observable<any> {
    if (email === 'a@a.com' && password === 'toto') { // Les identifiants
      this.setToken('abcdefghijklmnopqrstuvwxyz'); // Set du token ici
      return of({ name: 'Toto', email: 'a@a.com' }); // Un retour de valeur - Utile ?
    }
    return throwError(() => new Error('Failed to login')); // Si identifiant pas bon 
  } 
}
