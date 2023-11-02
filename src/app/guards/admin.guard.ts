import { CanActivateFn } from '@angular/router';
import { UsersService } from '../partage/services/users.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);  
  //const role = usersService.rolesArray.toString();
  //const toto = usersService.fetchAuthUserData(); 
  const isAdmin = usersService.rolesArray.includes('Administrateur');

  if (isAdmin ) {
    console.log("j'ai le bon rôle", usersService.rolesArray);      
    return true;
  } else {
    console.log("j'ai pas le bon rôle", isAdmin);    
    return false;
  }


};
