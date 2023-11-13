import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsersService } from '../partage/services/users.service';

export const redacteurKineGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);    
  const isRedacteur = usersService.profil.roles!.includes('Rédacteur');
  const isAdmin = usersService.profil.roles!.includes('Administrateur');
  const iskine = usersService.profil.roles!.includes('Rédacteur kiné');

  if (isRedacteur || isAdmin || iskine) {
    console.log("j'ai le bon rôle", usersService.profil.roles);      
    return true;
  } else {
    console.log("j'ai pas le bon rôle", usersService.profil.roles);    
    return false;
  }
};
