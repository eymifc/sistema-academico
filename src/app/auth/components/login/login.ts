import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
loginForm!: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private authService: Auth,private router: Router, public dialogRef: MatDialogRef<LoginComponent>) {}


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }


onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        console.log('¡Login Exitoso! Cerrando diálogo...');
        this.dialogRef.close();
      },
      error: (err) => {
        console.error('Error en el login:', err);

      }
    });
  }
}
