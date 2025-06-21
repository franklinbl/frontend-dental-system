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

  onDateSelected(date: string): void {
    this.selectedDate = date;
  }
}
