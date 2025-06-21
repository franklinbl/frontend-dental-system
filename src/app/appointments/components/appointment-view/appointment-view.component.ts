import { Component, Input } from '@angular/core';
import { Appointments } from '../../models/Appointments.model';

@Component({
  selector: 'app-appointment-view',
  standalone: true,
  imports: [],
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.scss']
})
export class AppointmentViewComponent {
  @Input() selectedDate: string | null = null;
  @Input() appointments: Appointments[] = [];

  getAppointmentsForDate(dateStr: string): any[] {
    return this.appointments.filter(appt => appt.date === dateStr);
  }
}
