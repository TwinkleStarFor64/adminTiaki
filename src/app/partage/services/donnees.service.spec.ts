import { TestBed } from '@angular/core/testing';

import { DonneesService } from './donnees.service';
import { HttpClientModule } from '@angular/common/http';

describe('DonneesService', () => {
  let service: DonneesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(DonneesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
