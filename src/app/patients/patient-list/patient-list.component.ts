import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import { MatNativeDateModule } from '@angular/material/core';
import { PatientService } from '../../services/patient.service';
import { DatePipe } from '@angular/common';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatNativeDateModule, DatePipe],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent {
  displayedColumns: string[] = ['name', 'dni', 'birthdate', 'address', 'email'];
  dataSource: Patient[] = [];

  constructor(private dialog: MatDialog, private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientService.getAll().subscribe(result => {
      this.dataSource = result;
    });
  }

  addPatient(): void {
    const dialogRef = this.dialog.open(PatientFormComponent);

    dialogRef.afterClosed().subscribe((result: Patient) => {
      if (result) {
        this.dataSource.unshift(result);
      }
    });
  }
}
