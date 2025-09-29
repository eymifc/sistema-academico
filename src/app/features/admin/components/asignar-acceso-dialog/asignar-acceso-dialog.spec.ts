import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarAccesoDialog } from './asignar-acceso-dialog';

describe('AsignarAccesoDialog', () => {
  let component: AsignarAccesoDialog;
  let fixture: ComponentFixture<AsignarAccesoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarAccesoDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarAccesoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
