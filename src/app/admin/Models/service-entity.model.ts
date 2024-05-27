import { Category } from './category.model';
export interface ServiceEntity {
  id: number| null;
  name: string;
  category: Category| null;
}
