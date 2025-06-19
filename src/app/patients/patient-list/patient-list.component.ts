import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { PatientService } from '../../services/patient.service';
import { DatePipe } from '@angular/common';
import { Patient } from '../models/Patient.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    MatTableModule,
    DatePipe,
    FormsModule
  ],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'dni', 'birthdate', 'address', 'email', 'actions'];
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

  viewPatient(patient: Patient): void {
    this.router.navigate(['/patients/view', patient.id]);
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
