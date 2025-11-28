import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'https://kanban-board-backend-gvqf.onrender.com/api/auth';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }
}
