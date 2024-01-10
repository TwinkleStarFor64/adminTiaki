import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientsComponent } from './ingredients.component';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { IngredientsPipe } from 'src/app/pipes/ingredients.pipe';

describe('IngredientsComponent', () => {
  let component: IngredientsComponent;
  let fixture: ComponentFixture<IngredientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngredientsComponent,IngredientsPipe],
      imports: [HttpClientModule,ButtonModule,PaginatorModule,NgxPaginationModule],
    });
    fixture = TestBed.createComponent(IngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
