import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuario } from '../../interfaces/usuario.interface';
import { UsuarioService } from '../../services/usuario';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { merge, of, Subject } from 'rxjs';
import { startWith, switchMap, catchError, map, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';
import { PersonalService } from '../../services/personal';
import { PersonalDialogComponent } from '../../components/personal-dialog/personal-dialog';
import { PersonalListado } from '../../interfaces/personalListado.interface';
import { AsignarAccesoDialog } from '../../components/asignar-acceso-dialog/asignar-acceso-dialog';
import { ModificarAccesoDialog } from '../../components/modificar-acceso-dialog/modificar-acceso-dialog';
import { PdfService } from '../../services/PdfService';

@Component({
  selector: 'app-gestion-usuarios',
    standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css'
})
export class GestionUsuarios implements  AfterViewInit{


  displayedColumns: string[] = ['foto', 'nombreCompleto', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<PersonalListado>([]);
  totalPersonas = 0;
  isLoadingResults = true;


  @ViewChild(MatPaginator) paginator!: MatPaginator;


  filtroControl = new Subject<string>();
  filtroEstado: number | null = null;
  searchTerm: string = '';

  private refreshTrigger = new Subject<void>();

  constructor(
    private usuarioService: UsuarioService,
    public dialog: MatDialog,
    private personalService: PersonalService,
    private pdfService: PdfService
  ) {}


  ngAfterViewInit(): void {

    const paginatorChanges = this.paginator.page;


    const filtroChanges = this.filtroControl.pipe(
      debounceTime(300),
      distinctUntilChanged()
    );


  merge(paginatorChanges, filtroChanges, this.refreshTrigger)
    .pipe(
      startWith({}),
      tap(() => this.isLoadingResults = true),
      switchMap(() => {
        const estado = this.filtroEstado;
        return this.personalService.listarPaginado(
            this.searchTerm,
            this.filtroEstado,
            this.paginator.pageIndex,
            this.paginator.pageSize
          ).pipe(catchError(() => observableOf(null)));
        }),
      map(data => {
        this.isLoadingResults = false; // Esto se queda igual
        if (data === null) {
          return [];
        }
         this.totalPersonas = data.totalElements;
        return data.content;
      })
    )
    .subscribe(data => (this.dataSource.data = data));
  }


  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim().toLowerCase();
    this.filtroControl.next(this.searchTerm);
  }

  cambioDeEstado() {

    this.refreshTrigger.next();
  }


  borrar(usuario: Usuario): void {

    console.log('Eliminando (Baja Lógica):', usuario.login);
    this.usuarioService.eliminarUsuario(usuario.login).subscribe(() => {

      this.refreshTrigger.next();
    });
  }



    nuevoUsuario(): void {

    const dialogRef = this.dialog.open(PersonalDialogComponent, {
      width: '650px',
      disableClose: true
    });


    dialogRef.afterClosed().pipe(

      switchMap(result => {
         console.log('Paso 2: Diálogo cerrado. Resultado recibido:', result);
        if (result && result.formData) {

          return this.personalService.crearPersonal(result.formData).pipe(

            switchMap(nuevoPersonal => {
              if (result.file) {

                return this.personalService.subirFoto(nuevoPersonal.codp, result.file);
              } else {

                return of(nuevoPersonal);
              }
            })
          );
        }

        return of(null);
      })
    ).subscribe(personalCreado => {

      if (personalCreado) {
        console.log('¡Personal creado exitosamente!', personalCreado);

       setTimeout(() => this.refreshTrigger.next(), 0);
      }
    });
  }


  getFotoUrl(fotoUrl: string): string {
    if (fotoUrl) {

    return `http://localhost:8080/uploads/fotos-personal/${fotoUrl}`;
    }

    return 'assets/img/default-user.png';
  }

  editarPersonal(persona: PersonalListado): void {

    this.personalService.getById(persona.codp).pipe(

      switchMap(personalCompleto => {

        const dialogRef = this.dialog.open(PersonalDialogComponent, {
          width: '650px',
          disableClose: true,
          data: personalCompleto
        });
        return dialogRef.afterClosed();
      }),

      switchMap(result => {
        if (result && result.formData) {

          return this.personalService.actualizar(persona.codp, result.formData).pipe(

            switchMap(personalActualizado => {
              if (result.file) {
                return this.personalService.subirFoto(personalActualizado.codp, result.file);
              } else {
                return of(personalActualizado);
              }
            })
          );
        }
        return of(null);
      })
    ).subscribe(resultadoFinal => {

      if (resultadoFinal) {
        console.log('¡Personal actualizado exitosamente!', resultadoFinal);
        setTimeout(() => this.refreshTrigger.next(), 0);
      }
    });
  }

   borrarPersonal(persona: PersonalListado): void {

    this.personalService.eliminar(persona.codp).subscribe(() => {
      console.log('Persona dada de baja exitosamente');

      setTimeout(() => this.refreshTrigger.next(), 0);
    });
  }

    habilitarPersonal(persona: PersonalListado): void {

    this.personalService.habilitar(persona.codp).subscribe(() => {
      console.log('Persona habilitada exitosamente');

      setTimeout(() => this.refreshTrigger.next(), 0);
    });
  }

  asignarAcceso(persona: PersonalListado): void {
    const dialogRef = this.dialog.open(AsignarAccesoDialog, {
      width: '450px',
      disableClose: true,
      data: {
        codp: persona.codp,
        nombreCompleto: persona.nombreCompleto
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.login && result.password) {
        this.usuarioService.asignarAcceso(result).subscribe({
          next: () => {
            console.log('Acceso asignado exitosamente');
            setTimeout(() => this.refreshTrigger.next(), 0);
          },
          error: (err) => {
            console.error('Error al asignar acceso:', err);
          }
        });
      }
    });
  }

  modificarAcceso(persona: PersonalListado): void {

    this.usuarioService.getUsuarioPorCodp(persona.codp).subscribe(usuario => {
      if (usuario) {

        const dialogRef = this.dialog.open(ModificarAccesoDialog, {
          width: '450px',
          disableClose: true,
          data: {
            codp: persona.codp,
            nombreCompleto: persona.nombreCompleto,
            login: usuario.login
          }
        });


        dialogRef.afterClosed().subscribe(result => {
          if (result && result.newPassword) {
            this.usuarioService.modificarPassword(persona.codp, result.newPassword).subscribe({
              next: () => {
                console.log('Contraseña actualizada exitosamente');

              },
              error: (err) => {
                console.error('Error al modificar la contraseña:', err);
              }
            });
          }
        });
      } else {

        console.error('Error: No se pudo encontrar el usuario para la persona con codp:', persona.codp);
      }
    });
  }

verReporte(persona: PersonalListado): void {
    // 1. Buscamos los datos completos de la persona
    this.personalService.getById(persona.codp).subscribe(personalCompleto => {
      if (personalCompleto) {
        // 2. Llamamos al servicio de PDF para generar el reporte
        console.log('Generando PDF para:', personalCompleto);
        this.pdfService.generarPdfPersona(personalCompleto);
      }
    });
  }

}
