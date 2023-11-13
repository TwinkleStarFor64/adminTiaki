import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redacteurGuard } from './redacteur.guard';

describe('redacteurGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => redacteurGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
