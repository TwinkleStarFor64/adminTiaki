import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NutritionComponent } from './nutrition.component';
import { ButtonModule } from 'primeng/button';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GetIngredientPipe, IngredientsPipe, PlatsPipe } from 'src/app/pipes/nutrition.pipe';

describe('NutritionComponent', () => {
  let component: NutritionComponent;
  let fixture: ComponentFixture<NutritionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NutritionComponent, PlatsPipe, IngredientsPipe, GetIngredientPipe ],
      imports: [RouterModule, ButtonModule, NgxPaginationModule, ToastModule, ConfirmDialogModule, ConfirmPopupModule, FormsModule],
    });
    fixture = TestBed.createComponent(NutritionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
