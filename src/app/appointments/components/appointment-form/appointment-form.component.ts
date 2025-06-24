import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

interface Patient {
  id: number;
  name: string;
  dni: string;
}

interface DialogData {
  selectedDate: string | null;
  mode: 'create' | 'edit';
  appointment?: any;
}

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent {
  appointmentForm: FormGroup;
  isEditMode = false;
  isEditing = false;

  // Datos de prueba
  allPatients: Patient[] = [
    { id: 1, name: 'Juan Pérez', dni: '12345678' },
    { id: 2, name: 'María García', dni: '23456789' },
    { id: 3, name: 'Carlos López', dni: '34567890' },
    { id: 4, name: 'Ana Rodríguez', dni: '45678901' },
    { id: 5, name: 'Luis Martínez', dni: '56789012' },
    { id: 6, name: 'Carmen Sánchez', dni: '67890123' },
    { id: 7, name: 'Roberto Torres', dni: '78901234' },
    { id: 8, name: 'Isabel Morales', dni: '89012345' },
    { id: 9, name: 'Fernando Silva', dni: '90123456' },
    { id: 10, name: 'Patricia Vargas', dni: '01234567' }
  ];

  filteredPatients: Patient[] = [];
  showDropdown = false;
  selectedPatient: Patient | null = null;
  patientDisplayValue = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isEditMode = data.mode === 'edit';

    this.appointmentForm = this.fb.group({
      patientId: [null, Validators.required],
      patientDisplay: ['', [Validators.required, Validators.minLength(2)]],
      time: ['', Validators.required],
      date: [data.selectedDate || new Date().toISOString().split('T')[0], Validators.required],
      notes: ['']
    });

    // Si es modo edición, cargar los datos de la cita
    if (this.isEditMode && data.appointment) {
      this.loadAppointmentData(data.appointment);
    }

    // Suscribirse a cambios en el campo patientDisplay para filtrar
    this.appointmentForm.get('patientDisplay')?.valueChanges.subscribe(value => {
      this.filterPatients(value);
    });
  }

  loadAppointmentData(appointment: any): void {
    // Buscar el paciente en la lista de prueba
    const patient = this.allPatients.find(p => p.name === appointment.patient || p.id.toString() === appointment.patient);

    if (patient) {
      this.selectedPatient = patient;
      this.patientDisplayValue = `${patient.name} - ${patient.dni}`;
    }

    // Convertir formato de hora si es necesario
    const convertedTime = this.convertTimeFormat(appointment.time);

    this.appointmentForm.patchValue({
      patientId: patient?.id || appointment.patient,
      patientDisplay: this.patientDisplayValue || appointment.patient,
      time: convertedTime,
      date: appointment.date,
      notes: appointment.notes || ''
    });

    // Deshabilitar campos en modo edición
    this.disableForm();
  }

  convertTimeFormat(timeString: string): string {
    // Si ya está en formato 24 horas (HH:mm), retornarlo tal como está
    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
      return timeString;
    }

    // Si está en formato 12 horas (HH:MM AM/PM), convertirlo
    if (timeString.includes('AM') || timeString.includes('PM')) {
      try {
        // Crear una fecha temporal para usar los métodos de Date
        const [time, period] = timeString.split(' ');
        const [hours, minutes] = time.split(':');

        let hour = parseInt(hours);
        const minute = parseInt(minutes);

        // Convertir a formato 24 horas
        if (period === 'PM' && hour !== 12) {
          hour += 12;
        } else if (period === 'AM' && hour === 12) {
          hour = 0;
        }

        // Formatear con ceros a la izquierda
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      } catch (error) {
        console.error('Error converting time format:', error);
        return timeString; // Retornar original si hay error
      }
    }

    // Si no coincide con ningún formato conocido, retornar tal como está
    return timeString;
  }

  disableForm(): void {
    this.appointmentForm.get('patientDisplay')?.disable();
    this.appointmentForm.get('time')?.disable();
    this.appointmentForm.get('date')?.disable();
    this.appointmentForm.get('notes')?.disable();
  }

  enableForm(): void {
    this.appointmentForm.get('patientDisplay')?.enable();
    this.appointmentForm.get('time')?.enable();
    this.appointmentForm.get('date')?.enable();
    this.appointmentForm.get('notes')?.enable();

    // Asegurar que el campo patientDisplay pueda recibir eventos
    const patientDisplayControl = this.appointmentForm.get('patientDisplay');
    if (patientDisplayControl) {
      patientDisplayControl.enable();
    }
  }

  startEditing(): void {
    this.isEditing = true;
    this.enableForm();
  }

  filterPatients(searchTerm: string): void {
    // Solo filtrar si no es modo edición O si está en modo edición y se está editando
    if (this.isEditMode && !this.isEditing) {
      return;
    }

    if (!searchTerm || searchTerm.length < 2) {
      this.filteredPatients = [];
      this.showDropdown = false;
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredPatients = this.allPatients.filter(patient =>
      patient.name.toLowerCase().includes(term) ||
      patient.dni.includes(term)
    );

    this.showDropdown = this.filteredPatients.length > 0;
  }

  selectPatient(patient: Patient): void {
    this.selectedPatient = patient;
    this.patientDisplayValue = `${patient.name} - ${patient.dni}`;

    // Actualizar el formulario
    this.appointmentForm.patchValue({
      patientId: patient.id,
      patientDisplay: this.patientDisplayValue
    });

    this.showDropdown = false;
  }

  onInputFocus(): void {
    // Solo mostrar dropdown si no es modo edición O si está en modo edición y se está editando
    if ((!this.isEditMode || this.isEditing) &&
        this.appointmentForm.get('patientDisplay')?.value &&
        this.filteredPatients.length > 0) {
      this.showDropdown = true;
    }
  }

  onInputBlur(): void {
    // Pequeño delay para permitir que se ejecute el click en la lista
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      // Crear el objeto a enviar con el ID del paciente
      const formData = {
        ...this.appointmentForm.value,
        patient: this.appointmentForm.value.patientId
      };

      // Si es modo edición, mantener el formato original de la hora
      if (this.isEditMode && this.data.appointment) {
        const originalTime = this.data.appointment.time;
        // Si la hora original tenía AM/PM, convertir de vuelta al formato original
        if (originalTime.includes('AM') || originalTime.includes('PM')) {
          formData.time = this.convertTo12HourFormat(this.appointmentForm.value.time);
        }
      }

      // Remover campos internos que no van al backend
      delete formData.patientId;
      delete formData.patientDisplay;

      this.dialogRef.close(formData);
    }
  }

  convertTo12HourFormat(time24: string): string {
    try {
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours);
      const minute = parseInt(minutes);

      let period = 'AM';
      let displayHour = hour;

      if (hour >= 12) {
        period = 'PM';
        if (hour > 12) {
          displayHour = hour - 12;
        }
      }

      if (hour === 0) {
        displayHour = 12;
      }

      return `${displayHour}:${minutes} ${period}`;
    } catch (error) {
      console.error('Error converting to 12-hour format:', error);
      return time24; // Retornar original si hay error
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}