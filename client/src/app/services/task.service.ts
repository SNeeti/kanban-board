import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private API_URL = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'authorization': token || ''
      })
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
