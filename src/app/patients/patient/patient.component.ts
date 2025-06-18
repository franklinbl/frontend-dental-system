import { Component, OnInit } from '@angular/core';
import { PersonalInformationComponent } from '../components/personalInformation/PersonalInformation.component';
import { MedicalHistoyComponent } from '../components/medicalHistoy/MedicalHistoy.component';
import { TreatmentRecordComponent } from '../components/treatmentRecord/TreatmentRecord.component';
import { ToothRecordComponent } from '../components/toothRecord/ToothRecord.component';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    PersonalInformationComponent,
    MedicalHistoyComponent,
    TreatmentRecordComponent,
    ToothRecordComponent
  ],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
  }
}
