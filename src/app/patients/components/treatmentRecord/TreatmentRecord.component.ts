import { Component, OnInit, input } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { TreatmentRecord } from '../../models/TreatmentRecord.model';

@Component({
  selector: 'app-treatment-record',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './treatmentRecord.component.html',
  styleUrls: ['./treatmentRecord.component.scss']
})
export class TreatmentRecordComponent implements OnInit {
  patientId = input<string | null>();
  treatmentRecord: TreatmentRecord = {
    id: 1,
    patientId: 1,
    date: '2024-06-01T10:00:00Z',
    treatmentDescription: 'Limpieza dental y aplicación de flúor',
    amountPaid: 50.00,
    remainingBalance: 25.00,
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z'
  };

  constructor() {}

  ngOnInit(): void {
  }
}
