import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserType } from '../admin/Models/user-type.enum';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        if (response.user.userType === UserType.ADMIN) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'You do not have permission to access this resource';
      }
      },
      (error: any) => {
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
}
