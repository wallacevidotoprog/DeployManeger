import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpStatus } from '../../../backend--nodejs/src/utils/HttpStatus';
import { environment } from '../environments/environment';
import { GithubDeploy } from '../types/deploy.type';
import { ResponseApi } from '../types/response.type';

@Injectable({
  providedIn: 'root',
})
export class DeployService {
  private http = inject(HttpClient);

  createDeploy(data_deploy: GithubDeploy): Observable<ResponseApi> {
    return this.http
      .post<ResponseApi>(`${environment.apiUrl}deploy/import`, data_deploy, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.status === HttpStatus.CREATED) {
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
}
