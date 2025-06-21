import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Appointments } from '../../models/Appointments.model';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent {
  @Output() dateSelected = new EventEmitter<string>();
  @Input() selectedDate: string | null = null;
  @Input() appointments: Appointments[] = [];

  today = new Date();
  currentMonth = this.today.getMonth(); // Enero es 0
  currentYear = this.today.getFullYear();

  // Array for calendar grid (6 weeks * 7 days = 42)
  calendarDays = Array.from({ length: 42 }, (_, i) => i);

  getDaysInMonth(month: number, year: number) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 (domingo) a 6 (sábado)
    return { daysInMonth, firstDay };
  }

  getAppointmentsForDate(dateStr: string): any[] {
    return this.appointments.filter(appt => appt.date === dateStr);
  }

  selectDate(day: number): void {
    const month = (this.currentMonth + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const selectedDate = `${this.currentYear}-${month}-${dayStr}`;
    this.dateSelected.emit(selectedDate);
  }

  isDaySelected(index: number, month: number, year: number): boolean {
    if (!this.selectedDate) return false;
    const dateStr = this.getDateString(index, month, year);
    return dateStr === this.selectedDate;
  }

  getMonthName(monthIndex: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthIndex];
  }

  shouldRenderEmptyCell(index: number, month: number, year: number): boolean {
    const firstDay = new Date(year, month, 1).getDay();
    return index < (firstDay === 0 ? 6 : firstDay - 1); // Ajustar domingo (0) a posición 6
  }

  isDayInMonth(index: number, month: number, year: number): boolean {
    const { daysInMonth } = this.getDaysInMonth(month, year);
    const firstDay = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    const dayNumber = index - adjustedFirstDay + 1;
    return dayNumber > 0 && dayNumber <= daysInMonth;
  }

  getDayNumber(index: number, month: number, year: number): number {
    const firstDay = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    return index - adjustedFirstDay + 1;
  }

  hasAppointments(index: number, month: number, year: number): boolean {
    const dateStr = this.getDateString(index, month, year);
    return this.getAppointmentsForDate(dateStr).length > 0;
  }

  countAppointments(index: number, month: number, year: number): number {
    const dateStr = this.getDateString(index, month, year);
    return this.getAppointmentsForDate(dateStr).length;
  }

  getDateString(index: number, month: number, year: number): string {
    const day = this.getDayNumber(index, month, year);
    const monthStr = (month + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  }

  goToPreviousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  goToNextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  goToToday(): void {
    // Cambiar la vista del calendario al mes y año actual
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();

    // Emitir la fecha de hoy
    this.dateSelected.emit(today.toISOString().split('T')[0]);
  }
}
