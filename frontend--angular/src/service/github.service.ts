import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GithubProfile, GithubRepository } from '../models/gitHub.model';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private http = inject(HttpClient);

  getProfile(profile: string): Observable<GithubProfile> {
    return this.http.get<GithubProfile>(`https://api.github.com/users/${profile}`).pipe();
  }

  getReposiory(user: string): Observable<GithubRepository[]> {
    return this.http.get<GithubRepository[]>(`https://api.github.com/users/${user}/repos`).pipe();
  }





}
