import { Component } from '@angular/core';
import { CalendarViewComponent } from '../components/calendar-view/calendar-view.component';
import { AppointmentViewComponent } from '../components/appointment-view/appointment-view.component';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CalendarViewComponent, AppointmentViewComponent],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent {
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
}
