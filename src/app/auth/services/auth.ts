import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UserProfile, UserProfileService } from '../../core/services/user-profile';


import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class Auth {
  private apiUrl = 'http://localhost:8080/api/v1/auth';
  constructor(private http: HttpClient, private userProfileService: UserProfileService, private router: Router) { }

  login(credentials: {login: string, password: string}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {


        const decodedToken: any = jwtDecode(response.token);
        this.userProfileService.setCurrentUser(decodedToken);

        localStorage.setItem('jwt_token', response.token);


        localStorage.setItem('username', decodedToken.usuario);


        localStorage.setItem('fullName', decodedToken.nombreCompleto);


        localStorage.setItem('loginDate', decodedToken.fecha_creacion);


        localStorage.setItem('roles', JSON.stringify(decodedToken.roles));


      })
    );
  }

  logout(): void {

    localStorage.removeItem('jwt_token');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('loginDate');
    localStorage.removeItem('roles');

    this.userProfileService.setCurrentUser(null);
    this.router.navigate(['/']);
    console.log('Usuario desconectado y datos de sesión eliminados.');
  }

}
