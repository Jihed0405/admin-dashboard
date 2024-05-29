import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './Models/user.model';
import { BASE_URL } from './const/consts';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${BASE_URL}/api/users`;
  private apiAuthUrl = `${BASE_URL}/api/authentication`;
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  getUsersByType(userType: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/byType`, { params: { userType } }).pipe(
      catchError(this.handleError)
    );
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiAuthUrl}/register`, user).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  updateUser(id: number, updateUserRequest: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, updateUserRequest).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError.bind(this))
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
                console.log(error);
                errorMessage = this.extractAndSortMessages(error.error.message);
            } else {
                errorMessage = 'Server-side error. Please try again later.';
            }
        }
    }

    return throwError(errorMessage);
  }

  private extractAndSortMessages(messages: string): string {
    const messageArray = messages.split(', ');
    const sortedMessages = messageArray.sort();
    const cleanedMessages = sortedMessages.map(message => {
      const splitMessage = message.split(': ');
      return splitMessage.length > 1 ? splitMessage[1] : splitMessage[0];
    });
    return cleanedMessages.join(', ');
  }
  
}
