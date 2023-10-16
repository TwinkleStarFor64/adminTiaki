import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = new Router();  
  const token = sessionStorage.getItem('token');

  if (token) {     
    return true;      
  } else {
    router.navigate(['']) 
    return false;
  }

};


//Tutoriel : https://www.youtube.com/watch?v=tFsCynatnlo

  /* console.log('token dans auth.guard.ts', token);
  console.log(route);
  console.log(state); */