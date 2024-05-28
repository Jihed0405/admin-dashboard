import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { UserService } from '../user.service';
import { User } from '../Models/user.model';
import { NotificationService } from '../notification.service';
import { ServiceProviderService } from '../service-provider.service';
import { ServiceProvider } from '../Models/serviceProvider';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  clients: User[] = [];
  serviceProviders: ServiceProvider[] = [];

  constructor(
    private userService: UserService,
    private serviceProviderService: ServiceProviderService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadServiceProviders();
  }

  loadClients(): void {
    this.userService.getUsersByType('CLIENT').subscribe({
      next: (data) => {
        this.clients = data;
        this.clients.sort((a, b) => a.id! - b.id!);
      },
      error: (err) => {
        console.error('Error loading clients', err);
      }
    });
  }

  loadServiceProviders(): void {
    this.serviceProviderService.getAllServiceProviders().subscribe({
      next: (serviceProviderData) => {
        this.serviceProviders = serviceProviderData;
        this.serviceProviders.sort((a, b) => a.id! - b.id!);
      },
      error: (err) => {
        console.error('Error loading service providers', err);
      }
    });
  }

  deleteClient(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.notificationService.showNotification('Client deleted successfully', "success-snackbar");
        this.loadClients();
      },
      error: (errorMessage) => {
        this.notificationService.showNotification(errorMessage, "error-snackbar");
      }
    });
  }

  deleteServiceProvider(id: number): void {
    this.serviceProviderService.deleteServiceProvider(id).subscribe({
      next: () => {
        this.notificationService.showNotification('Service Provider deleted successfully', "success-snackbar");
        this.loadServiceProviders();
      },
      error: (errorMessage) => {
        this.notificationService.showNotification(errorMessage, "error-snackbar");
      }
    });
  }

  openAddClientDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user: null, userType: 'CLIENT' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.showNotification('Client added successfully', "success-snackbar");
        this.loadClients();
        
      }
    });
  }

  openAddServiceProviderDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user: null, userType: 'SERVICE_PROVIDER' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.showNotification('Service Provider added successfully', "success-snackbar");
        this.loadServiceProviders();
      }
    });
  }

  openEditClientDialog(client: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user: client, userType: 'CLIENT' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.showNotification('Client edited successfully', "success-snackbar");
        this.loadClients();
      }
    });
  }

  openEditServiceProviderDialog(serviceProvider: ServiceProvider): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user: serviceProvider, userType: 'SERVICE_PROVIDER' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.showNotification('Service Provider edited successfully', "success-snackbar");
        this.loadServiceProviders();
      }
    });
  }
}
