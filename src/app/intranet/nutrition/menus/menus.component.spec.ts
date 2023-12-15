import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusComponent } from './menus.component';
import { ButtonModule } from 'primeng/button';
import { PlatsPipe } from 'src/app/pipes/plats.pipe';
import { PaginatorModule } from 'primeng/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { IngredientsPipe } from 'src/app/pipes/ingredients.pipe';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MenusPipe } from 'src/app/pipes/menus.pipe';

describe('MenusComponent', () => {
  let component: MenusComponent;
  let fixture: ComponentFixture<MenusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenusComponent, PlatsPipe, IngredientsPipe, MenusPipe],
      imports: [ButtonModule, PaginatorModule, NgxPaginationModule, ToastModule, ConfirmDialogModule, ConfirmPopupModule]
    });
    fixture = TestBed.createComponent(MenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
