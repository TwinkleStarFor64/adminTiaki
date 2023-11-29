import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redacteurNutrtionGuard } from './redacteur-nutrtion.guard';

describe('redacteurNutrtionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => redacteurNutrtionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
