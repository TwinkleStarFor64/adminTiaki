import { TestBed } from '@angular/core/testing';
import { NutritionService } from './nutrition.service';
import { HttpClientModule } from '@angular/common/http';

describe('NutritionService', () => {
  let service: NutritionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientModule],
      providers: []
    });
    service = TestBed.inject(NutritionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
