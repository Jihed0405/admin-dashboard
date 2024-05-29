import { UserType } from "./user-type.enum";

export interface User {
    id: number| null;
    username:string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    phoneNumber: string;
    address: string;
    photoUrl?: string; 
 
  }
  