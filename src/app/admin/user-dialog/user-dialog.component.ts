import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { User } from '../Models/user.model';
import { NotificationService } from '../notification.service';
@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent {
  user: User;

  constructor(
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private userService: UserService,private notificationService :NotificationService
  ) {
    this.user = data.user ? { ...data.user } : {
      id: null,
      firstName: '',
      lastName: '',
      password: '',
      email: '',
      phoneNumber: '',
      address: '',
      photoUrl: ''
    };
  }

  save(): void {
    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.password) {
      this.notificationService.showNotification('Please fill in all required fields', 'error-snackbar');
      return;
    }
  
    // Check if the email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.user.email)) {
      this.notificationService.showNotification('Please enter a valid email address', 'error-snackbar');
      return;
    }
    if (this.user.id) {
      this.userService.updateUser(this.user.id, this.user).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {

      this.userService.createUser(this.user).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
