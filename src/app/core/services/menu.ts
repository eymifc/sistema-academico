import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menu } from '../../features/admin/interfaces/menu.interface';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:8080/api/v1/roles';

  constructor(private http: HttpClient) { }

  getMenusByRoleId(roleId: number): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.apiUrl}/${roleId}/menus`);
  }
}