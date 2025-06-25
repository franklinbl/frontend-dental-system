import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Patient } from '../../../patients/models/Patient.model';
import { AppointmentService } from '../../../services/appointment.service';
import { UsersService } from '../../../services/users.service';
import { Dentist } from '../../../users/models/users.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

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
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditMode = false;
  isEditing = false;

  // Datos de prueba para pacientes
  allPatients: Patient[] = [];

  // Lista de dentistas cargados desde el backend
  allDentists: Dentist[] = [];

  filteredPatients: Patient[] = [];
  filteredDentists: Dentist[] = [];
  showDropdown = false;
  showDentistDropdown = false;
  selectedPatient: Patient | null = null;
  selectedDentist: Dentist | null = null;
  patientDisplayValue = '';
  dentistDisplayValue = '';
  isLoadingDentists = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private appointmentService: AppointmentService,
    private usersService: UsersService
  ) {
    this.isEditMode = data.mode === 'edit';

    // Inicializar la lista de pacientes inmediatamente
    this.allPatients = this.appointmentService.allPatients;

    this.appointmentForm = this.fb.group({
      patientId: [null, Validators.required],
      patientDisplay: ['', [Validators.required, Validators.minLength(2)]],
      userId: [null, Validators.required], // Cambiado de dentistId a userId
      dentistDisplay: ['', [Validators.required, Validators.minLength(2)]],
      time: ['', Validators.required],
      date: [data.selectedDate || new Date().toISOString().split('T')[0], Validators.required],
      notes: ['']
    });

    // Si es modo edición, cargar los datos de la cita
    if (this.isEditMode && data.appointment) {
      // Pequeño delay para asegurar que allPatients esté disponible
      setTimeout(() => {
        this.loadAppointmentData(data.appointment);
      }, 0);
    }

    // Suscribirse a cambios en el campo patientDisplay para filtrar
    this.appointmentForm.get('patientDisplay')?.valueChanges.subscribe(value => {
      this.filterPatients(value);
    });

    // Suscribirse a cambios en el campo dentistDisplay para buscar dentistas en el backend
    this.appointmentForm.get('dentistDisplay')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && value.length >= 2) {
          this.isLoadingDentists = true;
          return this.usersService.searchDentists(value);
        } else {
          this.filteredDentists = [];
          this.isLoadingDentists = false;
          return of(null);
        }
      })
    ).subscribe(response => {
      this.isLoadingDentists = false;
      if (response && response.success) {
        this.allDentists = response.data;
        this.filteredDentists = response.data;
        this.showDentistDropdown = response.data.length > 0;
      } else {
        this.filteredDentists = [];
        this.showDentistDropdown = false;
      }
    });
  }

  ngOnInit(): void {
    // La inicialización ya se hace en el constructor
  }

  loadAppointmentData(appointment: any): void {
    // Buscar el paciente en la lista de prueba usando patientId o patientName
    const patient = this.allPatients.find(p =>
      p.id === appointment.patientId ||
      p.name === appointment.patientName ||
      p.id?.toString() === appointment.patientId
    );

    if (patient) {
      this.selectedPatient = patient;
      this.patientDisplayValue = `${patient.name} - ${patient.dni}`;
    } else {
      // Si no se encuentra el paciente, usar el patientName si existe
      this.patientDisplayValue = appointment.patientName || appointment.patient || '';
    }

    // Buscar el dentista en la lista actual o cargarlo desde el backend
    let dentist = this.allDentists.find(d =>
      d.id === appointment.dentistId ||
      d.id === appointment.userId ||
      d.name === appointment.dentistName
    );

    if (dentist) {
      this.selectedDentist = dentist;
      this.dentistDisplayValue = `${dentist.name} - ${dentist.dni}`;
    } else {
      // Si no se encuentra el dentista en la lista actual, intentar cargarlo desde el backend
      const dentistId = appointment.dentistId || appointment.userId;
      if (dentistId) {
        // Buscar por ID en el backend
        this.usersService.searchDentists(dentistId.toString()).subscribe(response => {
          if (response && response.success && response.data.length > 0) {
            dentist = response.data[0];
            this.selectedDentist = dentist;
            this.dentistDisplayValue = `${dentist.name} - ${dentist.dni}`;

            // Actualizar el formulario con los datos del dentista
            this.appointmentForm.patchValue({
              userId: dentist.id,
              dentistDisplay: this.dentistDisplayValue
            });
          } else {
            this.dentistDisplayValue = appointment.dentistName || '';
          }
        });
      } else {
        this.dentistDisplayValue = appointment.dentistName || '';
      }
    }

    // Convertir formato de hora si es necesario
    const convertedTime = this.convertTimeFormat(appointment.time);

    this.appointmentForm.patchValue({
      patientId: patient?.id || appointment.patientId || appointment.patient,
      patientDisplay: this.patientDisplayValue,
      userId: dentist?.id || appointment.dentistId || appointment.userId,
      dentistDisplay: this.dentistDisplayValue,
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
    this.appointmentForm.get('dentistDisplay')?.disable();
    this.appointmentForm.get('time')?.disable();
    this.appointmentForm.get('date')?.disable();
    this.appointmentForm.get('notes')?.disable();

    // Asegurar que el campo patientDisplay pueda recibir eventos
    const patientDisplayControl = this.appointmentForm.get('patientDisplay');
    if (patientDisplayControl) {
      patientDisplayControl.enable();
    }
  }

  enableForm(): void {
    this.appointmentForm.get('patientDisplay')?.enable();
    this.appointmentForm.get('dentistDisplay')?.enable();
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

  filterDentists(searchTerm: string): void {
    // Solo filtrar si no es modo edición O si está en modo edición y se está editando
    if (this.isEditMode && !this.isEditing) {
      return;
    }

    if (!searchTerm || searchTerm.length < 2) {
      this.filteredDentists = [];
      this.showDentistDropdown = false;
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredDentists = this.allDentists.filter(dentist =>
      dentist.name.toLowerCase().includes(term) ||
      (dentist.dni && dentist.dni.includes(term))
    );

    this.showDentistDropdown = this.filteredDentists.length > 0;
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

  selectDentist(dentist: Dentist): void {
    this.selectedDentist = dentist;
    this.dentistDisplayValue = `${dentist.name} - ${dentist.dni}`;

    // Actualizar el formulario
    this.appointmentForm.patchValue({
      userId: dentist.id,
      dentistDisplay: this.dentistDisplayValue
    });

    this.showDentistDropdown = false;
  }

  onInputFocus(): void {
    // Solo mostrar dropdown si no es modo edición O si está en modo edición y se está editando
    if ((!this.isEditMode || this.isEditing) &&
        this.appointmentForm.get('patientDisplay')?.value &&
        this.filteredPatients.length > 0) {
      this.showDropdown = true;
    }
  }

  onDentistInputFocus(): void {
    // Solo mostrar dropdown si no es modo edición O si está en modo edición y se está editando
    console.log(this.appointmentForm.value);
    if ((!this.isEditMode || this.isEditing) &&
        this.appointmentForm.get('dentistDisplay')?.value &&
        this.filteredDentists.length > 0) {
      this.showDentistDropdown = true;
    }
  }

  onInputBlur(): void {
    // Pequeño delay para permitir que se ejecute el click en la lista
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  onDentistInputBlur(): void {
    // Pequeño delay para permitir que se ejecute el click en la lista
    setTimeout(() => {
      this.showDentistDropdown = false;
    }, 200);
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      // Crear el objeto a enviar con el ID del paciente y dentista
      const formData = {
        ...this.appointmentForm.value,
        patientId: this.appointmentForm.value.patientId,
        userId: this.appointmentForm.value.userId
      };

      // Si es modo edición, incluir el ID de la cita y mantener el formato original de la hora
      if (this.isEditMode && this.data.appointment) {
        formData.id = this.data.appointment.id; // Agregar el ID de la cita

        const originalTime = this.data.appointment.time;
        // Si la hora original tenía AM/PM, convertir de vuelta al formato original
        if (originalTime.includes('AM') || originalTime.includes('PM')) {
          formData.time = this.convertTo12HourFormat(this.appointmentForm.value.time);
        }
      } else {
        // Si es modo creación, siempre convertir a formato 12 horas
        formData.time = this.convertTo12HourFormat(this.appointmentForm.value.time);
      }

      // Remover campos internos que no van al backend
      delete formData.patientDisplay;
      delete formData.dentistDisplay;

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