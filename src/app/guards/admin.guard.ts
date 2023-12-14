import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsersService } from '../partage/services/users.service';

export const adminGuard: CanActivateFn = () => {
  const usersService = inject(UsersService);    
  const roles = usersService.profil?.roles; // Supprime l'opérateur d'affirmation non nulle
  const isAdmin = roles?.includes('admin'); // Utilise l'opérateur de chaînage optionnel
  if (isAdmin) {
    console.log("j'ai le bon rôle", roles);      
    return true;
  } else {
    console.log("j'ai pas le bon rôle", roles);    
    return false;
  }
};