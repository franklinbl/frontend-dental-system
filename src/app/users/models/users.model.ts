export interface Dentist {
  id: number;
  name: string;
  email: string;
  dni?: string;
  phone?: string;
  isActive: boolean;
  roleId: number;
  role?: {
    id: number;
    name: string;
    description?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface DentistSearchResponse {
  success: boolean;
  data: Dentist[];
  total: number;
  message: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  dni?: string;
  phone?: string;
  isActive: boolean;
  roleId: number;
  createdAt?: string;
  updatedAt?: string;
}
