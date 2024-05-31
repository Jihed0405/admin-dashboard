import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { UserService } from '../user.service';
import { User } from '../Models/user.model';
import { NotificationService } from '../notification.service';
import { ServiceProviderService } from '../service-provider.service';
import { ServiceProvider } from '../Models/serviceProvider';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  clients: User[] = [];
  serviceProviders: ServiceProvider[] = [];
  dataSourceClients!: MatTableDataSource<User>;
  dataSourceServiceProviders!: MatTableDataSource<ServiceProvider>;

  @ViewChild('clientPaginator') clientPaginator!: MatPaginator;
  @ViewChild('serviceProviderPaginator') serviceProviderPaginator!: MatPaginator;
  @ViewChild('clientSort') clientSort!: MatSort;
  @ViewChild('serviceProviderSort') serviceProviderSort!: MatSort;
 
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
  ngAfterViewInit() {
    
    
  }
  loadClients(): void {
    this.userService.getUsersByType('CLIENT').subscribe({
      next: (data) => {
        data.sort((a, b) => a.id! - b.id!);
        this.clients = data;
        this.dataSourceClients = new MatTableDataSource(data);
        this.dataSourceClients.paginator = this.clientPaginator;
        this.dataSourceClients.sort = this.clientSort;
       
      },
      error: (err) => {
        console.error('Error loading clients', err);
      }
    });
  }

  loadServiceProviders(): void {
    this.serviceProviderService.getAllServiceProviders().subscribe({
      next: (serviceProviderData) => {
        serviceProviderData.sort((a, b) => a.id! - b.id!);
        this.serviceProviders = serviceProviderData;
        
        this.dataSourceServiceProviders = new MatTableDataSource(serviceProviderData);
        this.dataSourceServiceProviders.paginator = this.serviceProviderPaginator;
        this.dataSourceServiceProviders.sort = this.serviceProviderSort;
      },
      error: (err) => {
        console.error('Error loading service providers', err);
      }
    });
  }

 applyClientFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceClients.filter = filterValue.trim().toLowerCase();
}

applyServiceProviderFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceServiceProviders.filter = filterValue.trim().toLowerCase();
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
