import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsersService } from '../partage/services/users.service';

export const redacteurOptoGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);    
  const isRedacteur = usersService.profil.roles!.includes('redacteur');
  const isAdmin = usersService.profil.roles!.includes('admin');
  const isOpto = usersService.profil.roles!.includes('opto');

  if (isRedacteur || isAdmin || isOpto) {
    console.log("j'ai le bon rôle", usersService.profil.roles);      
    return true;
  } else {
    console.log("j'ai pas le bon rôle", usersService.profil.roles);    
    return false;
  }
};
