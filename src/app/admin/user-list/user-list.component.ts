import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { UserService } from '../user.service';
import { User } from '../Models/user.model';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }

  deleteUser(id: number): void {
    
    this.userService.deleteUser(id).subscribe( {
      next: () => {
        this.notificationService.showNotification('User deleted successfully',"success-snackbar");
        this.loadUsers();
    },
    error: (errorMessage) => {
       
        this.notificationService.showNotification(errorMessage,"error-snackbar");
        
    }
     
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.showNotification('User added successfully',"success-snackbar");
        this.loadUsers();
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.showNotification('User edited successfully',"success-snackbar");
        this.loadUsers();
      }
    });
  }
}
