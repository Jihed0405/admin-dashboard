import { ServiceEntity } from "./service-entity.model";
import { User } from "./user.model";

export interface ServiceProvider extends User {
    
    bio: string;
    numberOfExperiences: number;
    services?: ServiceEntity[];
}