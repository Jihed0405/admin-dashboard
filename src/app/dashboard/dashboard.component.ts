import { Component , ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  constructor(private authService: AuthService) {}
  toggleSidenav(): void {
    this.sidenav.toggle();
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }
}
