import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AsignarAccesoResult } from '../../interfaces/AsignarAccesoResult';
import { AsignarAccesoData } from '../../interfaces/AsignarAccesoData';
@Component({
  selector: 'app-asignar-acceso-dialog',
   standalone: true,
  imports: [
        CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './asignar-acceso-dialog.html',
  styleUrl: './asignar-acceso-dialog.css'
})
export class AsignarAccesoDialog {
credenciales: AsignarAccesoResult = {};
  confirmPassword = '';
  
  constructor( public dialogRef: MatDialogRef<AsignarAccesoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AsignarAccesoData){
      this.credenciales.codp = data.codp;
    }
}
