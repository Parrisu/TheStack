import { Address } from './../models/address';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { Technology } from '../models/technology';
import { Nodes } from '../models/node';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = `${environment.baseUrl}api/users`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  searchUsers(query: string): Observable<User[]> {
    const endpoint = this.baseUrl;
    const params = new HttpParams().set('query', query);
    return this.http
      .get<User[]>(endpoint, {
        params: params,
      })
      .pipe(
        catchError((err: any) => {
          console.log(err);
          return throwError(
            () =>
              new Error(
                `
            UserService.searchUsers(query: string): Observable<User[]>;
            Error while attempting get to ${endpoint} with query ${query}.
            `
              )
          );
        })
      );
  }

  setUserAddress(address: Address): Observable<Address> {
    const endpoint = `${this.baseUrl}/address`;
    const credentials = this.auth.getCredentials();
    const body = address.intoJsObject();
    return this.http
      .put<Address>(endpoint, body, {
        headers: new HttpHeaders({
          Authorization: `Basic ${credentials}`,
          'X-Requested-With': 'XMLHttpRequest',
        }),
      })
      .pipe(
        catchError((err: any) => {
          console.log(err);
          return throwError(
            () =>
              new Error(`
                UserService.setUserAddress(userId: number, address: Address): Observable<Address>;
                Error while attempting PUT to ${endpoint}.
                With body ${JSON.stringify(body)}
              `)
          );
        })
      );
  }

  updateUser(user: User) {
    const endpoint = `${this.baseUrl}/account`;
    const credentials = this.auth.getCredentials();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Basic ${credentials}`,
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };

    return this.http.post<User>(endpoint, user, httpOptions).pipe(
      catchError((err: any) => {
        console.log(err);
        return throwError(
          () =>
            new Error(`
                UserService.updateUser(user: User);
                Error while attempting POST to ${endpoint}.
                With body ${JSON.stringify(user)}
              `)
        );
      })
    );
  }

  destroy(id: number) {
    const endpoint = `${this.baseUrl}/account/${id}`;
    const credentials = this.auth.getCredentials();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Basic ${credentials}`,
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };

    return this.http.delete<User>(endpoint, httpOptions).pipe(
      catchError((err: any) => {
        console.log(err);
        return throwError(
          () =>
            new Error(`
                UserService.Destroy(id: number);
                Error while attempting Delete to ${endpoint}.
              `)
        );
      })
    );
  }
  getGroups(id: number): Observable<Nodes[]> {
    const endpoint = `${this.baseUrl}/${id}/nodes`;
    const credentials = this.auth.getCredentials();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Basic ${credentials}`,
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };

    return this.http.get<Nodes[]>(endpoint, httpOptions).pipe(
      catchError((err: any) => {
        console.log(err);
        return throwError(
          () =>
            new Error(`
                UserService.Destroy(id: number);
                Error while attempting Delete to ${endpoint}.
              `)
        );
      })
    );
  }

  reactivate(id: number) {
    const endpoint = `${this.baseUrl}/account/${id}`;
    const credentials = this.auth.getCredentials();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Basic ${credentials}`,
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };

    return this.http.get<User>(endpoint, httpOptions).pipe(
      catchError((err: any) => {
        console.log(err);
        return throwError(
          () =>
            new Error(`
                UserService.reactivate(id: number);
                Error while attempting GET to ${endpoint}.
              `)
        );
      })
    );
  }

  addOrRemoveTech(id: number, tech: Technology) {
    const endpoint = `${this.baseUrl}/account/${id}`;
    const credentials = this.auth.getCredentials();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Basic ${credentials}`,
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };

    return this.http.post<User>(endpoint, tech, httpOptions).pipe(
      catchError((err: any) => {
        console.log(err);
        return throwError(
          () =>
            new Error(`
                UserService.updateUser(user: User);
                Error while attempting POST to ${endpoint}.
                With body ${JSON.stringify(tech)}
              `)
        );
      })
    );
  }
}
