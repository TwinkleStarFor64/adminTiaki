import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = new Router();
  const token = localStorage.getItem('token');

  console.log('token dans auth.guard.ts', token);
  console.log(route);
  console.log(state);

  if (token) {     
    return true;      
  } else {
    router.navigate(['']) 
    return false;
  }

};
