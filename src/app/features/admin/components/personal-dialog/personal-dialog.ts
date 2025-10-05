import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PersonalDTO } from '../../interfaces/personal.interfaceDTO';
import { PersonalService } from '../../services/personal';



@Component({
  selector: 'app-personal-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './personal-dialog.html',
  styleUrls: ['./personal-dialog.css']
})
export class PersonalDialogComponent implements OnInit {

  form!: FormGroup;
  selectedFile: File | null = null;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private personalService: PersonalService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PersonalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEditing = !!this.data?.codp;

    this.form = this.fb.group({
      cedula: [this.data?.cedula || '', [Validators.required]],
      nombre: [this.data?.nombre || '', [Validators.required]],
      ap: [this.data?.ap || '', [Validators.required]],
      am: [this.data?.am || '', [Validators.required]],
      genero: [this.data?.genero || null, [Validators.required]],
      fnac: [this.data?.fnac || null, [Validators.required]],
      ecivil: [this.data?.ecivil || null, [Validators.required]],
      tipo: [this.data?.tipo || null, [Validators.required]],
      direc: [this.data?.direc || ''],
      telf: [this.data?.telf || ''],
    });


    if (this.isEditing) {
      this.form.get('cedula')?.disable();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }


    const personalData: PersonalDTO = this.form.getRawValue();

    const action = this.isEditing
      ? this.personalService.actualizar(this.data.codp, personalData)
      : this.personalService.crearPersonal(personalData);

    action.subscribe({
      next: (response) => {
        const personId = response.codp;

        if (this.selectedFile) {
          this.personalService.subirFoto(personId, this.selectedFile).subscribe({
            next: () => {
              this.snackBar.open('¡Datos y foto guardados correctamente!', 'Cerrar', { duration: 3000 });
              this.dialogRef.close(true);
            },
            error: (err) => {
              this.snackBar.open('Los datos se guardaron, pero falló la subida de la foto.', 'Cerrar', { duration: 5000 });
            }
          });
        } else {
          this.snackBar.open('¡Guardado correctamente!', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        }
      },
      error: (errorResponse) => {
        console.error('Error del servidor:', errorResponse);
        if (typeof errorResponse === 'object' && errorResponse !== null) {
          Object.keys(errorResponse).forEach(fieldName => {
            const control = this.form.get(fieldName);
            if (control) {
              control.setErrors({ serverError: errorResponse[fieldName] });
            }
          });
          this.snackBar.open('Por favor, corrige los errores indicados.', 'Cerrar', { duration: 4000 });
        } else {
          this.snackBar.open(errorResponse, 'Cerrar', { duration: 5000 });
        }
      }
    });
  }

  getFotoUrl(fotoUrl: string | null): string {
    if (fotoUrl) {
      return `http://localhost:8080/uploads/fotos-personal/${fotoUrl}?${new Date().getTime()}`;
    }
    return 'assets/img/default-user.png';
  }
}

