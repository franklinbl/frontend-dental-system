import { Component, OnInit, signal } from '@angular/core';
import { PersonalInformationComponent } from '../components/personal-information/personal-information.component';
import { MedicalHistoyComponent } from '../components/medical-histoy/medical-histoy.component';
import { TreatmentRecordListComponent } from '../components/treatment-record-list/treatment-record-list.component';
import { ToothRecordComponent } from '../components/tooth-record/tooth-record.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    PersonalInformationComponent,
    MedicalHistoyComponent,
    TreatmentRecordListComponent,
    ToothRecordComponent
  ],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {}
  patientId = signal<string | null>(null);

  ngOnInit(): void {
    this.patientId.set(this.activatedRoute.snapshot.params['id']);
  }
}
