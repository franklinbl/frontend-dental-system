import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Appointments } from '../../models/Appointments.model';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent {
  @Input() selectedDate: string | null = null;
  @Input() appointments: Appointments[] = [];
  @Output() appointmentAdded = new EventEmitter<any>();

  constructor(private dialog: MatDialog) {}

  getAppointmentsForDate(dateStr: string): any[] {
    return this.appointments.filter(appt => appt.date === dateStr);
  }

  openAddAppointmentDialog(): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '500px',
      data: { selectedDate: this.selectedDate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Emitir la nueva cita al componente padre
        this.appointmentAdded.emit(result);
      }
    });
  }
}
