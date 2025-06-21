import { Component } from '@angular/core';
import { CalendarViewComponent } from '../components/calendar-view/calendar-view.component';
import { AppointmentListComponent } from '../components/appointment-list/appointment-list.component';

@Component({
  selector: 'app-appointment-view',
  standalone: true,
  imports: [CalendarViewComponent, AppointmentListComponent],
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.scss']
})
export class AppointmentViewComponent {
  selectedDate: string | null = new Date().toISOString().split('T')[0];
  appointments = [
    { date: '2025-06-05', patient: 'Ana López', time: '10:00 AM' },
    { date: '2025-06-05', patient: 'Carlos M.', time: '11:00 AM' },
    { date: '2025-06-10', patient: 'Laura G.', time: '09:30 AM' },
    { date: '2025-06-15', patient: 'Javier R.', time: '02:00 PM' },
  ];

  onDateSelected(date: string): void {
    this.selectedDate = date;
  }

  onAppointmentAdded(newAppointment: any): void {
    // Formatear la hora para mostrar en formato AM/PM
    const time = newAppointment.time;
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const formattedTime = `${displayHour}:${minutes} ${ampm}`;

    // Crear el objeto de cita con el formato correcto
    const appointment = {
      date: newAppointment.date,
      patient: newAppointment.patient,
      time: formattedTime,
      type: newAppointment.type,
      notes: newAppointment.notes
    };
    console.log(appointment);

    // Agregar la nueva cita al array
    this.appointments.push(appointment);
  }
}
