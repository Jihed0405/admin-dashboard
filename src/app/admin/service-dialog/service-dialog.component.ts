import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceEntity } from '../Models/service-entity.model';
import { Category } from '../Models/category.model'; // Import Category model
import { CategoryService } from '../category.service'; // Import CategoryService to load categories
import { ServiceEntityService } from '../service.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-service-dialog',
  templateUrl: './service-dialog.component.html',
  styleUrls: ['./service-dialog.component.css']
})
export class ServiceDialogComponent {
  service: any;
  categories: Category[] = [];

  constructor(
    private dialogRef: MatDialogRef<ServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { service: any },
    private serviceEntityService: ServiceEntityService,private categoryService: CategoryService,

  ) {
    this.service = data.service ? { ...data.service } : { id: null, name: '', category: null };
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data;
      if (this.service.category) {
        this.service['category'] = this.categories.find(category => category.id === this.service.category.id);
      }
    });
  }

  save(): void {
   
      if (this.service.id) {
        this.serviceEntityService.updateService(this.service.id, this.service).subscribe(() => {

          this.dialogRef.close(true);
         
        });
      } else {
        this.serviceEntityService.createService(this.service).subscribe(() => {
          this.dialogRef.close(true);
       
        });
      }
    }
  

  close(): void {
    this.dialogRef.close(false);
  }
}
