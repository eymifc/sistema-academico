import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Role } from '../../interfaces/role.interface';
import { RoleService } from '../../services/role';
import { RoleDialogComponent } from '../../components/role-dialog/role-dialog';
import { MatRadioModule } from '@angular/material/radio'; 


@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
     CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCardModule,
      MatRadioModule
   ],
  templateUrl: './role-list.html',
  styleUrl: './role-list.css'
})
export class RoleListComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Role>();

  constructor(private roleService: RoleService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe(data => {
      this.dataSource.data = data;
    });
  }

 openDialog(): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '400px',
      data: { nombre: '', estado: 1 } // Pasamos un objeto Role vacío
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.addRole({ nombre: result.nombre }).subscribe(() => {
          this.loadRoles();
        });
      }
    });
  }

    editRole(role: Role): void {
  
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '400px',
      data: { ...role } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.updateRole(result).subscribe(() => {
          this.loadRoles();
        });
      }
    });
  }

deleteRole(role: Role): void {
    const confirmation = confirm(`¿Estás seguro de que quieres dar de baja el rol "${role.nombre}"?`);
    
    if (confirmation) {
   
      this.roleService.deleteRole(role.codr).subscribe({
        next: () => {
   
          const index = this.dataSource.data.findIndex(r => r.codr === role.codr);
          if (index !== -1) {
          
            this.dataSource.data[index].estado = 0;
  
            this.dataSource.data = [...this.dataSource.data];
          }
          this.loadRoles();
        },
        error: (err) => {
 
          console.error("Error al dar de baja el rol", err);
          alert("No se pudo completar la operación. Por favor, intente de nuevo.");
        }
      });
    }
  }

  
}