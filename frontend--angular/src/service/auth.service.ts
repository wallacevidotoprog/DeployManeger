import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpStatus } from '../../../backend--nodejs/src/utils/HttpStatus';
import { environment } from '../environments/environment';
import { AuthLogin } from '../types/auth';
import { ResponseApi } from '../types/response.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  authLogin(data: AuthLogin): Observable<ResponseApi> {
    return this.http
      .post<ResponseApi>(`${environment.apiUrl}auth/login`, data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.status === HttpStatus.OK) {
            return {
              status: response.status,
              message: 'Deploy created successfully',
            } as ResponseApi;
          } else {
            const errorMessage = response.body as ResponseApi;
            return {
              status: response.status,
              message: errorMessage.message,
            } as ResponseApi;
          }
        })
      );
  }

  me(): Observable<boolean> {
    return this.http
      .get<ResponseApi>(`${environment.apiUrl}auth/me`, {
        withCredentials: true,
        observe: 'response'
      })
      .pipe(
        map(response => {          
          return response.status === HttpStatus.OK
        }),
        catchError(error => {
          console.error('Error in auth/me request:', error);
          return of(false); 
        })
      );
  }}
