import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointments } from '../appointments/models/Appointments.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointments: Appointments[] = [
    { id: 1, date: '2025-06-15', patientName: 'Ana López', patientId: 1, time: '10:00 AM', notes: 'Consulta de rutina' },
    { id: 2, date: '2025-06-15', patientName: 'Carlos M.', patientId: 2, time: '11:00 AM', notes: 'Limpieza dental' },
    { id: 3, date: '2025-06-16', patientName: 'Laura G.', patientId: 3, time: '09:30 AM', notes: 'Extracción de muela' },
    { id: 4, date: '2025-06-16', patientName: 'Javier R.', patientId: 4, time: '02:00 PM', notes: 'Ortodoncia' },
    { id: 5, date: '2025-06-17', patientName: 'María S.', patientId: 5, time: '08:00 AM', notes: 'Empaste dental' },
    { id: 6, date: '2025-06-17', patientName: 'Roberto T.', patientId: 6, time: '03:30 PM', notes: 'Consulta de emergencia' },
    { id: 7, date: '2025-06-18', patientName: 'Carmen V.', patientId: 7, time: '10:30 AM', notes: 'Blanqueamiento' },
    { id: 8, date: '2025-06-18', patientName: 'Fernando W.', patientId: 8, time: '01:00 PM', notes: 'Revisión post-tratamiento' },
    { id: 9, date: '2025-06-19', patientName: 'Isabel X.', patientId: 9, time: '11:30 AM', notes: 'Consulta de rutina' },
    { id: 10, date: '2025-06-19', patientName: 'Luis Y.', patientId: 10, time: '04:00 PM', notes: 'Endodoncia' },
    { id: 11, date: '2025-06-20', patientName: 'Patricia Z.', patientId: 11, time: '09:00 AM', notes: 'Limpieza dental' },
    { id: 12, date: '2025-06-20', patientName: 'Miguel A.', patientId: 12, time: '02:30 PM', notes: 'Consulta de ortodoncia' },
    { id: 13, date: '2025-06-21', patientName: 'Sofia B.', patientId: 13, time: '10:00 AM', notes: 'Extracción de cordal' },
    { id: 14, date: '2025-06-21', patientName: 'Diego C.', patientId: 14, time: '03:00 PM', notes: 'Empaste dental' },
    { id: 15, date: '2025-06-22', patientName: 'Valentina D.', patientId: 15, time: '08:30 AM', notes: 'Consulta de rutina' }
  ];

  private appointmentsSubject = new BehaviorSubject<Appointments[]>(this.appointments);

  constructor() {}

  // Obtener todas las citas
  getAllAppointments(): Observable<Appointments[]> {
    return this.appointmentsSubject.asObservable();
  }

  // Obtener citas por fecha
  getAppointmentsByDate(date: string): Observable<Appointments[]> {
    const filteredAppointments = this.appointments.filter(appt => appt.date === date);
    return new Observable(observer => {
      observer.next(filteredAppointments);
      observer.complete();
    });
  }

  // Obtener una cita por ID
  getAppointmentById(id: number): Observable<Appointments | null> {
    const appointment = this.appointments.find(appt => appt.id === id) || null;
    return new Observable(observer => {
      observer.next(appointment);
      observer.complete();
    });
  }

  // Crear nueva cita
  createAppointment(appointment: Omit<Appointments, 'id'>): Observable<Appointments> {
    const newId = Math.max(...this.appointments.map(appt => appt.id || 0)) + 1;
    const newAppointment: Appointments = {
      ...appointment,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.appointments.push(newAppointment);
    this.appointmentsSubject.next([...this.appointments]);

    return new Observable(observer => {
      observer.next(newAppointment);
      observer.complete();
    });
  }

  // Actualizar cita existente
  updateAppointment(id: number, appointment: Partial<Appointments>): Observable<Appointments | null> {
    const index = this.appointments.findIndex(appt => appt.id === id);

    if (index === -1) {
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    const updatedAppointment: Appointments = {
      ...this.appointments[index],
      ...appointment,
      id, // Mantener el ID original
      updatedAt: new Date().toISOString()
    };

    this.appointments[index] = updatedAppointment;
    this.appointmentsSubject.next([...this.appointments]);

    return new Observable(observer => {
      observer.next(updatedAppointment);
      observer.complete();
    });
  }

  // Eliminar cita
  deleteAppointment(id: number): Observable<boolean> {
    const index = this.appointments.findIndex(appt => appt.id === id);

    if (index === -1) {
      return new Observable(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    this.appointments.splice(index, 1);
    this.appointmentsSubject.next([...this.appointments]);

    return new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  // Buscar citas por paciente
  searchAppointmentsByPatient(patientName: string): Observable<Appointments[]> {
    const filteredAppointments = this.appointments.filter(appt =>
      appt.patientName?.toLowerCase().includes(patientName.toLowerCase())
    );

    return new Observable(observer => {
      observer.next(filteredAppointments);
      observer.complete();
    });
  }

  // Obtener próximas citas (desde hoy)
  getUpcomingAppointments(): Observable<Appointments[]> {
    const today = new Date().toISOString().split('T')[0];
    const upcomingAppointments = this.appointments
      .filter(appt => appt.date >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return new Observable(observer => {
      observer.next(upcomingAppointments);
      observer.complete();
    });
  }

  // Verificar disponibilidad de horario
  checkTimeAvailability(date: string, time: string, excludeId?: number): Observable<boolean> {
    const conflictingAppointment = this.appointments.find(appt =>
      appt.date === date &&
      appt.time === time &&
      appt.id !== excludeId
    );

    return new Observable(observer => {
      observer.next(!conflictingAppointment);
      observer.complete();
    });
  }

  // Obtener estadísticas básicas
  getAppointmentStats(): Observable<{
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    const todayDate = new Date();
    const weekStart = new Date(todayDate.getTime() - (todayDate.getDay() * 24 * 60 * 60 * 1000));
    const monthStart = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);

    const stats = {
      total: this.appointments.length,
      today: this.appointments.filter(appt => appt.date === today).length,
      thisWeek: this.appointments.filter(appt => {
        const apptDate = new Date(appt.date);
        return apptDate >= weekStart && apptDate <= todayDate;
      }).length,
      thisMonth: this.appointments.filter(appt => {
        const apptDate = new Date(appt.date);
        return apptDate >= monthStart && apptDate <= todayDate;
      }).length
    };

    return new Observable(observer => {
      observer.next(stats);
      observer.complete();
    });
  }
}
