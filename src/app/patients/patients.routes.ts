import { Routes } from '@angular/router';

export const PATIENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./patient-list/patient-list.component').then(c => c.PatientListComponent)
  },
  {
    path: 'list',
    loadComponent: () => import('./patient-list/patient-list.component').then(c => c.PatientListComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./patient/patient.component').then(c => c.PatientComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./patient/patient.component').then(c => c.PatientComponent)
  }
];