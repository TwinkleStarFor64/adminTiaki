import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../partage/services/supabase.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = new Router();
  const supa = inject(SupabaseService); // Pour récupérer la variable token définie dans la méthode signIn - bloque le refresh de la page web  

  const tokenDev = sessionStorage.getItem('token'); // Remplacer par le token de supabase.service !!

  // if token ou if supa ??
  if (supa.token) { // Le token attribué dans supabase.service        
    return true; 
  } else {
    router.navigate(['']) 
    return false;
  }

};


//Tutoriel : https://www.youtube.com/watch?v=tFsCynatnlo
