import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarAccesoDialog } from './modificar-acceso-dialog';

describe('ModificarAccesoDialog', () => {
  let component: ModificarAccesoDialog;
  let fixture: ComponentFixture<ModificarAccesoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarAccesoDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarAccesoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
