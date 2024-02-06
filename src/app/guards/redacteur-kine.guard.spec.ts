import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redacteurKineGuard } from './redacteur-kine.guard';

describe('redacteurKineGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => redacteurKineGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
