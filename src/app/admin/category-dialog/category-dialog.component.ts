import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../category.service';
import { Category } from '../Models/category.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent {
  category: Category;

  constructor(
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category: Category },
    private categoryService: CategoryService, private notificationService: NotificationService
  ) {
    this.category = data.category ? { ...data.category } : { id: null, name: '' };
  }

  save(): void {
    if (this.category.id) {
      this.categoryService.updateCategory(this.category.id, this.category).subscribe(
        () => {
        this.dialogRef.close(true);
      },
      (error) => {
        this.notificationService.showNotification(error, 'error-snackbar');
      });
    } else {
      if (!this.category.name) {
       this.notificationService.showNotification('Please enter a name', 'error-snackbar') ;
        return;
      }
      this.categoryService.createCategory(this.category).subscribe(() => {
        this.dialogRef.close(true);
      },
      (error) => {
        this.notificationService.showNotification(error, 'error-snackbar');
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
