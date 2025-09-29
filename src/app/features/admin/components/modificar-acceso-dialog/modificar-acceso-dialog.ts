import { Component , Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ModificarAccesoData } from '../../interfaces/ModificarAccesoData';
@Component({
  selector: 'app-modificar-acceso-dialog',
  imports: [  CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './modificar-acceso-dialog.html',
  styleUrl: './modificar-acceso-dialog.css'
})
export class ModificarAccesoDialog {
  nuevaPassword = '';
  confirmPassword = '';

    constructor(
    public dialogRef: MatDialogRef<ModificarAccesoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ModificarAccesoData
  ) {}
}
