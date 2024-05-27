import { Component , ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  constructor() {}
  toggleSidenav(): void {
    this.sidenav.toggle();
  }
}
