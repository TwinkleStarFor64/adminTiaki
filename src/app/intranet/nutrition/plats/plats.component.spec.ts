import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatsComponent } from './plats.component';
import { ButtonModule } from 'primeng/button';
import { PlatsPipe } from 'src/app/pipes/plats.pipe';
import { PaginatorModule } from 'primeng/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { IngredientsPipe } from 'src/app/pipes/ingredients.pipe';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

describe('PlatsComponent', () => {
  let component: PlatsComponent;
  let fixture: ComponentFixture<PlatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlatsComponent, PlatsPipe, IngredientsPipe],
      imports: [ButtonModule, PaginatorModule, NgxPaginationModule, ToastModule, ConfirmDialogModule, ConfirmPopupModule]
    });
    fixture = TestBed.createComponent(PlatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
