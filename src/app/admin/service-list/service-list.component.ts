import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogComponent } from '../service-dialog/service-dialog.component';
import { ServiceEntityService } from '../service.service';
import { ServiceEntity } from '../Models/service-entity.model';
import { NotificationService } from '../notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css'],
})
export class ServiceListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource!: MatTableDataSource<ServiceEntity>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
        data.sort((a, b) => a.id! - b.id!);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error loading services', err);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
