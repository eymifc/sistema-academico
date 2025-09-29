import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../interfaces/role.interface';
import { PersonalDTO } from '../interfaces/personal.interfaceDTO';
import { Personal } from '../interfaces/personal.interface';
import { PaginatedResponse } from '../interfaces/paginated.interface';
import { PersonalListado } from '../interfaces/personalListado.interface';


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
    return this.http.post<Personal>(this.apiUrl, personalDTO);
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
    return this.http.put<Personal>(`${this.apiUrl}/${id}`, dto);
  }

   eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

    habilitar(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/habilitar`, {});
  }
}