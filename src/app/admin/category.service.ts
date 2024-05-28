import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Category } from './Models/category.model';
import { BASE_URL } from './const/consts';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${BASE_URL}/api/categories`;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  createCategory(category: Category): Observable<Category> {
   
    return this.http.post<Category>(`${this.apiUrl}/create`, category, { headers:this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateCategory(id: number, category: Category): Observable<Category> {
   
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category, { headers:this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteCategory(id: number): Observable<void> {
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
