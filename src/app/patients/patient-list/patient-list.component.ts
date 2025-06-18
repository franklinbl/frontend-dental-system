import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { PatientService } from '../../services/patient.service';
import { DatePipe } from '@angular/common';
import { Patient } from '../models/Patient.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatNativeDateModule,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'dni', 'birthdate', 'address', 'email'];
  dataSource: Patient[] = [];
  searchTerm: string = '';

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.patientService.getAll().subscribe(result => {
      this.dataSource = result;
    });
  }

  addPatient(): void {
    this.router.navigate(['/patients/add']);
  }

  searchPatient(): void {
    if (!this.searchTerm.trim()) {
      // Si no hay término de búsqueda, mostrar todos los pacientes
      this.patientService.getAll().subscribe(result => {
        this.dataSource = result;
      });
      return;
    }

    // Buscar pacientes que coincidan con el término de búsqueda
    const searchTermLower = this.searchTerm.toLowerCase();
    this.patientService.getAll().subscribe(result => {
      this.dataSource = result.filter(patient =>
        patient.name.toLowerCase().includes(searchTermLower) ||
        patient.dni.toLowerCase().includes(searchTermLower) ||
        (patient.email && patient.email.toLowerCase().includes(searchTermLower))
      );
    });
  }
}
