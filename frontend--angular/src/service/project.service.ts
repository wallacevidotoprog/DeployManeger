import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpStatus } from '../../../backend--nodejs/src/utils/HttpStatus';
import { environment } from '../environments/environment';
import { AuthLogin } from '../types/auth';
import { ResponseApi } from '../types/response.type';
import { ProcessModal } from '../types/process.types';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);

  getAllProjectProcess(): Observable<ResponseApi> {
    return this.http
      .get<ResponseApi>(`${environment.apiUrl}project/processes`, {
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
              data: response.body?.data
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
  getAllProject(): Observable<ResponseApi> {
    return this.http
      .get<ResponseApi>(`${environment.apiUrl}project/path-list`, {
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
              data: response.body?.data
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
}
