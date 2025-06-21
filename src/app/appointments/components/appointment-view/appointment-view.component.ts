import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-appointment-view',
  standalone: true,
  imports: [],
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.scss']
})
export class AppointmentViewComponent {
  @Input() selectedDate: string | null = null;

  // Datos de ejemplo de citas (con formato ISO YYYY-MM-DD)
  appointments = [
    { date: '2025-06-05', patient: 'Ana López', time: '10:00 AM' },
    { date: '2025-06-05', patient: 'Carlos M.', time: '11:00 AM' },
    { date: '2025-06-10', patient: 'Laura G.', time: '09:30 AM' },
    { date: '2025-06-15', patient: 'Javier R.', time: '02:00 PM' },
  ];

  getAppointmentsForDate(dateStr: string): any[] {
    return this.appointments.filter(appt => appt.date === dateStr);
  }
}
