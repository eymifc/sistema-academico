// src/app/components/dialogs/personal-dialog/personal-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Para ngModel

// --- Módulos de Angular Material ---
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { PersonalDTO } from '../../interfaces/personal.interfaceDTO';


@Component({
  selector: 'app-personal-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './personal-dialog.html',
  styleUrl: './personal-dialog.css'
})
export class PersonalDialogComponent {
 data: Partial<PersonalDTO> = {};
  
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<PersonalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public incomingData: any
  ) {
    if (this.incomingData) {
      this.data = { ...this.incomingData };
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  guardar(): void {
      console.log('Paso 1: Botón Guardar presionado.');
    const result = {
      formData: this.data,
      file: this.selectedFile
    };
    this.dialogRef.close(result);
  }

    getFotoUrl(fotoUrl: string | null): string {
    if (fotoUrl) {
      return `http://localhost:8080/uploads/fotos-personal/${fotoUrl}`;
    }
    return 'assets/img/default-user.png'; 
  }
}