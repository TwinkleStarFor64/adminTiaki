import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redacteurNutritionGuard } from './redacteur-nutrition.guard';

describe('redacteurNutrtionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => redacteurNutritionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
