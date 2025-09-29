import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Role } from '../../interfaces/role.interface';



@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [ 
     MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './role-dialog.html',
    styleUrl: './role-dialog.css'
})
export class RoleDialogComponent {

    isEditMode: boolean;
  constructor(
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role,
  ) {
        this.isEditMode = !!this.data.codr;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}