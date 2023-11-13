import { CanActivateFn } from '@angular/router';
import { UsersService } from '../partage/services/users.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);    
  const isAdmin = usersService.profil.roles!.includes('Administrateur');

  if (isAdmin) {
    console.log("j'ai le bon rôle", usersService.profil.roles);      
    return true;
  } else {
    console.log("j'ai pas le bon rôle", isAdmin);    
    return false;
  }
};
