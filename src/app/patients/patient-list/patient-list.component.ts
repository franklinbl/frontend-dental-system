import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import { MatNativeDateModule } from '@angular/material/core';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatNativeDateModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  patients: any[] = [];

  constructor(private dialog: MatDialog, private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientService.getAll().subscribe(result => {
      console.log(result);
    });
  }

  addPatient(): void {
    const dialogRef = this.dialog.open(PatientFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.patients.unshift(result);
      }
    });
  }
}
