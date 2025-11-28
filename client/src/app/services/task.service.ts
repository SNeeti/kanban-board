import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private API_URL = 'https://kanban-board-backend-gvqf.onrender.com/api/tasks';

  constructor(private http: HttpClient) {}

  // Safely build auth headers (works with SSR / no window on server)
  private getAuthHeaders() {
    let token = '';

    // Guard against SSR / Node where window & localStorage don't exist
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }

    const headersConfig: Record<string, string> = {};

    if (token) {
      headersConfig['authorization'] = token;
    }

    return {
      headers: new HttpHeaders(headersConfig)
    };
  }

  getTasks(): Observable<any> {
    return this.http.get(this.API_URL, this.getAuthHeaders());
  }

  addTask(title: string): Observable<any> {
    return this.http.post(this.API_URL, { title }, this.getAuthHeaders());
  }

  updateTask(id: string, task: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, task, this.getAuthHeaders());
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, this.getAuthHeaders());
  }
}
