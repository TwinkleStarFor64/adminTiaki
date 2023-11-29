import { CanActivateFn } from '@angular/router';
import { UsersService } from '../partage/services/users.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService); // Injection du service users.service.ts pour en utiliser les méthodes    
  const isAdmin = usersService.profil.roles!.includes('Administrateur'); // Profil est rempli dans users.service et contient les rôles

  if (isAdmin) {
    console.log("j'ai le bon rôle", usersService.profil.roles);      
    return true;
  } else {
    console.log("j'ai pas le bon rôle", isAdmin);    
    return false;
  }
};
