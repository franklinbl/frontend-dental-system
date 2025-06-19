import { Component, OnInit, input } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { TreatmentRecord } from '../../models/TreatmentRecord.model';
import { TreatmentRecordFormComponent } from '../treatmentRecordForm/TreatmentRecordForm.component';
import { TreatmentRecordService } from '../../../services/treatmentRecord.service';

@Component({
  selector: 'app-treatment-record-list',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, MatDialogModule],
  templateUrl: './treatmentRecordList.component.html',
  styleUrls: ['./treatmentRecordList.component.scss']
})
export class TreatmentRecordListComponent implements OnInit {
  patientId = input<string | null>();
  treatmentRecord: TreatmentRecord[] = [];

  constructor(private dialog: MatDialog, private treatmentRecordService: TreatmentRecordService) {}

  ngOnInit(): void {
    const patientId = this.patientId();
    if (!patientId) return;
    this.treatmentRecordService.getByPatientId(patientId).subscribe(result => {
      this.treatmentRecord = result;
      console.log(result);
    });
  }

  openTreatmentDialog(treatmentRecord?: TreatmentRecord): void {
    const patientId = this.patientId();
    if (!patientId) return;

    const isEditing = !!treatmentRecord;

    const dialogRef = this.dialog.open(TreatmentRecordFormComponent, {
      width: '500px',
      data: {
        patientId: this.patientId(),
        treatmentRecord: treatmentRecord,
        isEditMode: isEditing
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (isEditing) {
          // Modo edición - actualizar el registro existente
          console.log('Tratamiento actualizado:', result);
          const index = this.treatmentRecord.findIndex(tr => tr.id === result.id);
          if (index !== -1) {
            this.treatmentRecord[index] = result;
          }
        } else {
          // Modo creación - agregar nuevo registro al inicio
          console.log('Nuevo tratamiento:', result);
          this.treatmentRecord.unshift(result);
        }
      }
    });
  }
}
