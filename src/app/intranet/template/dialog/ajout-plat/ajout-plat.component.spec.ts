import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutPlatComponent } from './ajout-plat.component';
import { DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { IngredientsPipe } from 'src/app/pipes/ingredients.pipe';

describe('AjoutPlatComponent', () => {
  let component: AjoutPlatComponent;
  let fixture: ComponentFixture<AjoutPlatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutPlatComponent, IngredientsPipe],
      imports: [ DynamicDialogModule, FormsModule, ButtonModule, PaginatorModule, NgxPaginationModule],
      providers: [DynamicDialogRef]
    });
    fixture = TestBed.createComponent(AjoutPlatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
