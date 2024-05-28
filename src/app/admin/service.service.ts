import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ServiceEntity } from './Models/service-entity.model';
import { BASE_URL } from './const/consts';

@Injectable({
  providedIn: 'root'
})
export class ServiceEntityService {
  private apiUrl = `${BASE_URL}/api/services`;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getAllServices(): Observable<ServiceEntity[]> {
    return this.http.get<ServiceEntity[]>(this.apiUrl);
  }

  createService(service: ServiceEntity): Observable<ServiceEntity> {
    return this.http.post<ServiceEntity>(`${this.apiUrl}/create`, service, { headers: this.headers })
  }

  updateService(id: number, service: ServiceEntity): Observable<ServiceEntity> {
    return this.http.put<ServiceEntity>(`${this.apiUrl}/${id}`, service, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      console.log(error);
      // Server-side error
      errorMessage = ` ${error.error}`;
    }
    return throwError(errorMessage);
  }
}
