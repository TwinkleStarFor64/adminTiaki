import { CanActivateFn } from '@angular/router';
import { UsersService } from '../partage/services/users.service';
import { inject } from '@angular/core';

export const redacteurGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);    
  const isRedacteur = usersService.profil.roles!.includes('redacteur');
  const isAdmin = usersService.profil.roles!.includes('admin');

  if (isRedacteur || isAdmin) {
    console.log("j'ai le bon rôle",  usersService.profil.roles);      
    return true;
  } else {
    console.log("j'ai pas le bon rôle",  usersService.profil.roles);    
    return false;
  }
};
