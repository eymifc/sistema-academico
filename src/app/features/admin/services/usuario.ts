import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Usuario } from "../interfaces/usuario.interface";
import { Observable } from "rxjs";
import { PaginatedResponse } from "../interfaces/paginated.interface";
import { UsuarioAssignDTO } from "../interfaces/UsuarioAssignDTO";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
 private apiUrl = 'http://localhost:8080/api/v1/usuarios';

 constructor(private http: HttpClient) { }

 getUsuarios(
    searchTerm: string,
    estado: number | null,
    page: number,
    size: number
  ): Observable<PaginatedResponse<Usuario>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchTerm) {
      params = params.append('searchTerm', searchTerm);
    }
    if (estado !== null) {
      params = params.append('estado', estado.toString());
    }

    return this.http.get<PaginatedResponse<Usuario>>(this.apiUrl, { params });
  }


   eliminarUsuario(login: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${login}`);
  }

    habilitarUsuario(login: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${login}/habilitar`, {});
  }


  asignarAcceso(dto: UsuarioAssignDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/asignar-acceso`, dto);
  }

   modificarPassword(codp: number, newPassword: string): Observable<void> {
    const dto = { newPassword: newPassword };
    return this.http.put<void>(`${this.apiUrl}/persona/${codp}/password`, dto);
  }

  getUsuarioPorCodp(codp: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/persona/${codp}`);
  }
}
