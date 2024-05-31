import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { ServiceProviderService } from '../service-provider.service';
import { User } from '../Models/user.model';
import { ServiceProvider } from '../Models/serviceProvider';
import { NotificationService } from '../notification.service';
import { UserType } from '../Models/user-type.enum';
import { ServiceEntity } from '../Models/service-entity.model';
import { ServiceEntityService } from '../service.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent {
  user: ServiceProvider;
  userType: UserType;
  availableServices: ServiceEntity[] = [];
  selectedServices: ServiceEntity[] = [];

  constructor(
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: ServiceProvider, userType: UserType },
    private userService: UserService,
    private serviceEntityService: ServiceEntityService,
    private serviceProviderService: ServiceProviderService,
    private notificationService: NotificationService
  ) {
    this.user = data.user ? { ...data.user } : {
      id: null,
      firstName: '',
      lastName: '',
      password: '',
      email: '',
      phoneNumber: '',
      address: '',
      photoUrl: '',
      bio: '',
      numberOfExperiences: 0,
      username:'',
      services: []
    };
    this.userType = data.userType;

    if (this.userType === UserType.SERVICE_PROVIDER) {
      this.serviceEntityService.getAllServices().subscribe(
        services => {
          this.availableServices = services;
          if (this.user.id && this.user.services) {
            this.selectedServices = this.user.services.map(service => {
              const foundService = this.availableServices.find(s => s.id === service.id);
              // Handle cases where service entity is not found
              return foundService ? foundService : { id: null, name: '', category: null };
            });
          }
        },
        error => this.notificationService.showNotification(error.message, 'error-snackbar')
      );
    }

    if (this.user.services) {
      this.selectedServices = [...this.user.services];
    }
  }

  addService(): void {
    this.selectedServices.push({ id: null, name: '', category: null });
  }

  removeService(index: number): void {
    this.selectedServices.splice(index, 1);
  }

  save(): void {
   /* if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.password) {
      this.notificationService.showNotification('Please fill in all required fields', 'error-snackbar');
      return;
    }*/

    if (this.userType === UserType.SERVICE_PROVIDER) {
      const serviceProvider = this.user as ServiceProvider;
      this.selectedServices = this.selectedServices.filter(service => service.id !== null);
      serviceProvider.services = this.selectedServices;

      if (!serviceProvider.bio || serviceProvider.numberOfExperiences === undefined) {
        this.notificationService.showNotification('Please fill in all required fields for service provider', 'error-snackbar');
        return;
      }

      if (serviceProvider.id) {
        this.serviceProviderService.updateServiceProvider(serviceProvider.id, serviceProvider).subscribe(
          () => {
            this.dialogRef.close(true);
          },
          (error) => {
            this.notificationService.showNotification(error.message, 'error-snackbar');
          }
        );
      } else {
        console.log(serviceProvider);
        this.serviceProviderService.createServiceProvider(serviceProvider).subscribe(
          () => {
            this.dialogRef.close(true);
          },
          (error) => {
            this.notificationService.showNotification(error, 'error-snackbar');
          }
        );
      }
    } else {
      const user = this.user as User;
      if (user.id) {
        const updateUserRequest = {
          updatedUser: this.user
        };
        this.userService.updateUser(user.id, updateUserRequest).subscribe(
          () => {
            this.dialogRef.close(true);
          },
          (error) => {
            this.notificationService.showNotification(error.message, 'error-snackbar');
          }
        );
      } else {
        this.userService.createUser(user).subscribe(
          () => {
            this.dialogRef.close(true);
          },
          (error) => {
            this.notificationService.showNotification(error, 'error-snackbar');
          }
        );
      }
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
