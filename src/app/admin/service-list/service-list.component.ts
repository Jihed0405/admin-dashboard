import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogComponent } from '../service-dialog/service-dialog.component';
import { ServiceEntityService } from '../service.service';
import { ServiceEntity } from '../Models/service-entity.model';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css'],
})
export class ServiceListComponent implements OnInit {
  services: ServiceEntity[] = [];

  constructor(
    private serviceEntityService: ServiceEntityService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceEntityService.getAllServices().subscribe({
      next: (data) => {
        this.services = data;
      },
      error: (err) => {
        console.error('Error loading services', err);
      },
    });
  }

  deleteService(id: number): void {
    this.serviceEntityService.deleteService(id).subscribe({
      next: () => {
        this.notificationService.showNotification(
          'Service deleted successfully',
          'success-snackbar'
        );
        this.loadServices();
      },
      error: (errorMessage) => {
        this.notificationService.showNotification(
          errorMessage,
          'error-snackbar'
        );
      },
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      width: '400px',
      data: { service: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notificationService.showNotification(
          'Service added successfully',
          'success-snackbar'
        );
        this.loadServices();
      }
    });
  }

  openEditDialog(service: ServiceEntity): void {
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      width: '400px',
      data: { service },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notificationService.showNotification(
          'Service edited successfully',
          'success-snackbar'
        );
        this.loadServices();
      }
    });
  }
}
