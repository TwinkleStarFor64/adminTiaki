import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutMenuComponent } from './ajout-menu.component';

describe('AjoutMenuComponent', () => {
  let component: AjoutMenuComponent;
  let fixture: ComponentFixture<AjoutMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutMenuComponent]
    });
    fixture = TestBed.createComponent(AjoutMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
