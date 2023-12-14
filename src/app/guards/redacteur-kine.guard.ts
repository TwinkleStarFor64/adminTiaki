import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsersService } from '../partage/services/users.service';

export const redacteurKineGuard: CanActivateFn = () => {
  const usersService = inject(UsersService);    
  const roles = usersService.profil.roles!;
  const isRedacteur = roles.includes('redacteur');
  const isAdmin = roles.includes('admin');
  const isOpto = roles.includes('kine');

  if (isRedacteur || isAdmin || isOpto) {
    console.log("j'ai le bon rôle", roles);      
    return true;
  } else {
    console.log("j'ai pas le bon rôle", roles);    
    return false;
  }
};