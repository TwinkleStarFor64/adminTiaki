import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redacteurOptoGuard } from './redacteur-opto.guard';

describe('redacteurOptoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => redacteurOptoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
