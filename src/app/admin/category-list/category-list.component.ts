import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../category.service';
import { Category } from '../Models/category.model';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource!: MatTableDataSource<Category> ;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor( private notificationService: NotificationService,private categoryService: CategoryService,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        data.sort((a, b) => a.id! - b.id!);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error loading categories', err);
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe( {
      next: () => {
        this.notificationService.showNotification('Category deleted successfully',"success-snackbar");
        this.loadCategories();
    },
    error: (errorMessage) => {
        // Display the error message on the UI
        this.notificationService.showNotification(errorMessage,"error-snackbar");
        
    }
     
    });
  }
  openAddDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { category: null }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.showNotification('Category added successfully',"success-snackbar");
        this.loadCategories();
      }
    });
  }
  
  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { category }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.showNotification('Category edited successfully',"success-snackbar");
        this.loadCategories();
      }
    });
  }

 
}
