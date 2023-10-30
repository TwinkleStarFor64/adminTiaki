import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonneesMedicalesComponent } from './donnees-medicales.component';

describe('DonneesMedicalesComponent', () => {
  let component: DonneesMedicalesComponent;
  let fixture: ComponentFixture<DonneesMedicalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonneesMedicalesComponent]
    });
    fixture = TestBed.createComponent(DonneesMedicalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
