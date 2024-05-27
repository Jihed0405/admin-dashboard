export interface User {
    id: number| null;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    phoneNumber: string;
    address: string;
    photoUrl?: string; 
  }
  