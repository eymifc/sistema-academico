import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { Role } from '../interfaces/role.interface';
import { PersonalDTO } from '../interfaces/personal.interfaceDTO';
import { Personal } from '../interfaces/personal.interface';
import { PaginatedResponse } from '../interfaces/paginated.interface';
import { PersonalListado } from '../interfaces/personalListado.interface';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  private apiUrl = 'http://localhost:8080/api/v1/personal';

 constructor(private http: HttpClient) { }

listarPaginado(
    searchTerm: string,
    estado: number | null,
    page: number,
    size: number
  ): Observable<PaginatedResponse<PersonalListado>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchTerm) {
      params = params.append('searchTerm', searchTerm);
    }
    if (estado !== null) {
      params = params.append('estado', estado.toString());
    }

    return this.http.get<PaginatedResponse<PersonalListado>>(this.apiUrl, { params });
  }


  crearPersonal(personalDTO: Partial<PersonalDTO>): Observable<Personal> {
    return this.http.post<Personal>(this.apiUrl, personalDTO).pipe(
      catchError(this.handleError)
    );
  }

  subirFoto(codp: number, file: File): Observable<Personal> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Personal>(`${this.apiUrl}/${codp}/foto`, formData);
  }



  getById(id: number): Observable<Personal> {
    return this.http.get<Personal>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, dto: Partial<PersonalDTO>): Observable<Personal> {
    return this.http.put<Personal>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

   eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

    habilitar(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/habilitar`, {});
  }

  private handleError(error: HttpErrorResponse) {
    // La propiedad 'error' de HttpErrorResponse contiene el cuerpo de la respuesta de error del backend.
    // Lo retornamos para que el componente que llama al servicio pueda acceder a él.
    return throwError(() => error.error);
  }
}
