import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusComponent } from './menus.component';
import { MenusPipe } from 'src/app/pipes/menus.pipe';
import { PlatsPipe } from 'src/app/pipes/plats.pipe';
import { IngredientsPipe } from 'src/app/pipes/ingredients.pipe';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { HttpClientModule } from '@angular/common/http';

describe('MenusComponent', () => {
  let component: MenusComponent;
  let fixture: ComponentFixture<MenusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenusComponent, PlatsPipe,MenusPipe, IngredientsPipe],
      imports: [ButtonModule, PaginatorModule, NgxPaginationModule, ToastModule, ConfirmDialogModule, ConfirmPopupModule,HttpClientModule]
    });

    fixture = TestBed.createComponent(MenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
