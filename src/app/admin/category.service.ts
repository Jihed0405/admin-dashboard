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
  constructor(private http: HttpClient) {
    this.handleError = this.handleError.bind(this);
  }

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
    let errorMessage = 'An unknown error occurred. Please try again.';

    if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
    } else {
        if (error.status === 0) {
            errorMessage = 'No connection. Verify application is running.';
        } else if (error.status >= 400 && error.status < 500) {
            if (typeof error.error === 'string') {
                try {
                    const serverError = JSON.parse(error.error);
                    if (serverError.message) {
                        errorMessage = this.extractAndSortMessages(serverError.message);
                    }
                } catch (e) {
                    errorMessage = error.error;
                }
            } else if (error.error.message) {
                errorMessage = this.extractAndSortMessages(error.error.message);
            }
        } else if (error.status >= 500) {
            if (error) {
                console.log(error.error.message);
                errorMessage = this.extractAndSortMessages(error.error.message);
            } else {
                errorMessage = 'Server-side error. Please try again later.';
            }
        }
    }
console.log(errorMessage);
    return throwError(errorMessage);
  }

  private extractAndSortMessages(messages: string): string {
    const messageArray = messages.split(': ');
    if (messageArray.length < 2) return ''; // Ensure there is at least one colon-separated part
    const message = messageArray.slice(1).join(': '); // Extract the message without the prefix and suffix
    return message;
  }
  
}
