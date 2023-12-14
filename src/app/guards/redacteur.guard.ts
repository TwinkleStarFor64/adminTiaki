import { CanActivateFn } from '@angular/router';
import { UsersService } from '../partage/services/users.service';
import { inject } from '@angular/core';

export const redacteurGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);    
  const roles = usersService.profil.roles!.map(roleObj => roleObj.role);
  const isRedacteur = roles.includes('redacteur');
  const isAdmin = roles.includes('admin');

  if (isRedacteur || isAdmin) {
    console.log("j'ai le bon rôle", roles);      
    return true;
  } else {
    console.log("j'ai pas le bon rôle", roles);    
    return false;
  }
};
