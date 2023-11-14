import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NutritionComponent } from './nutrition.component';
import { ButtonModule } from 'primeng/button';

describe('NutritionComponent', () => {
  let component: NutritionComponent;
  let fixture: ComponentFixture<NutritionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NutritionComponent],
      imports: [ButtonModule],
    });
    fixture = TestBed.createComponent(NutritionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
