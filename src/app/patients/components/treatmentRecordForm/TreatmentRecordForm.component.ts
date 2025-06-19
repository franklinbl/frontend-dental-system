import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TreatmentRecordService } from '../../../services/treatmentRecord.service';
import { TreatmentRecord } from '../../models/TreatmentRecord.model';

export interface TreatmentRecordFormData {
  patientId: string;
  treatmentRecord?: TreatmentRecord;
  isEditMode?: boolean;
}

@Component({
  selector: 'app-treatment-record-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './TreatmentRecordForm.component.html',
  styleUrls: ['./TreatmentRecordForm.component.scss']
})
export class TreatmentRecordFormComponent implements OnInit {
  treatmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TreatmentRecordFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TreatmentRecordFormData,
    private treatmentRecordService: TreatmentRecordService
  ) {
    this.treatmentForm = this.fb.group({
      date: ['', [Validators.required]],
      treatmentDescription: ['', [Validators.required]],
      amountPaid: [null, [Validators.required, Validators.min(0)]],
      remainingBalance: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.data.treatmentRecord) {
      const formData = {
        ...this.data.treatmentRecord,
        date: this.formatDateForInput(this.data.treatmentRecord.date)
      };
      this.treatmentForm.patchValue(formData);
    }
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    // Ajustar la fecha para la zona horaria local
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.treatmentForm.valid) {
      // Obtener la fecha del formulario y convertirla correctamente
      const formDate = this.treatmentForm.get('date')?.value;
      let formattedDate = formDate;

      if (formDate) {
        // Crear una fecha local para evitar problemas de zona horaria
        const [year, month, day] = formDate.split('-');
        // Crear fecha en zona horaria local
        const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0);
        formattedDate = localDate.toISOString();
      }

      const formData = {
        ...this.treatmentForm.value,
        date: formattedDate,
        patientId: this.data.patientId
      };

      if (this.data.treatmentRecord && this.data.isEditMode && this.data.treatmentRecord.id) {
        // Modo edición - actualizar registro existente
        this.treatmentRecordService.update(this.data.treatmentRecord.id.toString(), formData).subscribe((response) => {
          this.dialogRef.close(response);
        });
      } else {
        // Modo creación - crear nuevo registro
        this.treatmentRecordService.create(formData).subscribe((response) => {
          this.dialogRef.close(response);
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.treatmentForm.reset();
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.treatmentForm.controls).forEach(key => {
      const control = this.treatmentForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.treatmentForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors && field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors && field.errors['min']) {
        return 'El valor debe ser mayor o igual a 0';
      }
    }
    return '';
  }
}