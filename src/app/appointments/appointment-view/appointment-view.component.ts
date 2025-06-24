import { Component, OnInit } from '@angular/core';
import { CalendarViewComponent } from '../components/calendar-view/calendar-view.component';
import { AppointmentListComponent } from '../components/appointment-list/appointment-list.component';
import { AppointmentService } from '../../services/appointment.service';
import { Appointments } from '../models/Appointments.model';

@Component({
  selector: 'app-appointment-view',
  standalone: true,
  imports: [CalendarViewComponent, AppointmentListComponent],
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.scss']
})
export class AppointmentViewComponent implements OnInit {
  selectedDate: string | null = new Date().toISOString().split('T')[0];
  appointments: Appointments[] = [];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en las citas
    this.appointmentService.getAllAppointments().subscribe(appointments => {
      this.appointments = appointments;
    });
  }

  onDateSelected(date: string): void {
    this.selectedDate = date;
  }

  onAppointmentAdded(newAppointment: any): void {
    // Crear la nueva cita usando el servicio
    this.appointmentService.createAppointment({
      date: newAppointment.date,
      patientId: newAppointment.patientId,
      time: newAppointment.time,
      notes: newAppointment.notes || ''
    }).subscribe(appointment => {
      console.log('Cita creada:', appointment);
    });
  }

  onAppointmentUpdated(updatedAppointment: any): void {
    // Actualizar la cita usando el servicio
    this.appointmentService.updateAppointment(updatedAppointment.id, {
      date: updatedAppointment.date,
      patientId: updatedAppointment.patientId,
      time: updatedAppointment.time,
      notes: updatedAppointment.notes || ''
    }).subscribe(appointment => {
      if (appointment) {
        console.log('Cita actualizada:', appointment);
      } else {
        console.error('No se pudo actualizar la cita');
      }
    });
  }
}
