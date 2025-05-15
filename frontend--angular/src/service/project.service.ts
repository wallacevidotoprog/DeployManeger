import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpStatus } from '../../../backend--nodejs/src/utils/HttpStatus';
import { environment } from '../environments/environment';
import { SetFileProject } from '../types/project.types';
import { ResponseApi } from '../types/response.type';

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
              data: response.body?.data,
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
              data: response.body?.data,
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

  getFileProject(pathFile: string): Observable<ResponseApi> {
    return this.http
      .get<ResponseApi>(`${environment.apiUrl}project/get-file`, {
        params: { filename: pathFile },
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
              data: response.body?.data,
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

  setFileProject(file: SetFileProject): Observable<ResponseApi> {
    return this.http
      .post<ResponseApi>(`${environment.apiUrl}project/set-file`, file, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },

        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.status === HttpStatus.OK || response.status === HttpStatus.OK) {
            return {
              status: response.status,
            } as ResponseApi;
          } else {
            const errorMessage = response.body as ResponseApi;
            return {
              status: response.status,
              message: errorMessage?.message,
            } as ResponseApi;
          }
        })
      );
  }

  getPackage(pathFile: string): Observable<ResponseApi> {
    return this.http
      .get<ResponseApi>(`${environment.apiUrl}project/package`, {
        params: { name: pathFile },
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
              data: response.body?.data,
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
