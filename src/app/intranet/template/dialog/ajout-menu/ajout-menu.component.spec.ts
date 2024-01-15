import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjoutMenuComponent } from './ajout-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { NgxPaginationModule } from 'ngx-pagination';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenusPipe, NutrimentsPipe, PlatsPipe } from 'src/app/pipes/nutrition.pipe';
import { HttpClientModule } from '@angular/common/http';
<<<<<<< HEAD

=======
import { HttpClientModule } from '@angular/common/http';
>>>>>>> deab73b21c8948804160e526efb04bc57815ccc1

describe('AjoutMenuComponent', () => {
  let component: AjoutMenuComponent;
  let fixture: ComponentFixture<AjoutMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
<<<<<<< HEAD
=======

>>>>>>> deab73b21c8948804160e526efb04bc57815ccc1
      declarations: [AjoutMenuComponent,MenusPipe,PlatsPipe, NutrimentsPipe],
      imports: [ReactiveFormsModule,FormsModule,ButtonModule,NgxPaginationModule,HttpClientModule],
      providers: [DynamicDialogRef]
    });
    fixture = TestBed.createComponent(AjoutMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
