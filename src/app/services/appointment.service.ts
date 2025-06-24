import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointments } from '../appointments/models/Appointments.model';
import { Patient } from '../patients/models/Patient.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  // Lista de pacientes de prueba
  public allPatients: Patient[] = [
    { id: 1, name: 'Juan Pérez', dni: '12345678', birthDate: new Date().toISOString() },
    { id: 2, name: 'María García', dni: '23456789', birthDate: new Date().toISOString() },
    { id: 3, name: 'Carlos López', dni: '34567890', birthDate: new Date().toISOString() },
    { id: 4, name: 'Ana Rodríguez', dni: '45678901', birthDate: new Date().toISOString() },
    { id: 5, name: 'Luis Martínez', dni: '56789012', birthDate: new Date().toISOString() },
    { id: 6, name: 'Carmen Sánchez', dni: '67890123', birthDate: new Date().toISOString() },
    { id: 7, name: 'Roberto Torres', dni: '78901234', birthDate: new Date().toISOString() },
    { id: 8, name: 'Isabel Morales', dni: '89012345', birthDate: new Date().toISOString() },
    { id: 9, name: 'Fernando Silva', dni: '90123456', birthDate: new Date().toISOString() },
    { id: 10, name: 'Patricia Vargas', dni: '01234567', birthDate: new Date().toISOString() }
  ];

  private appointments: Appointments[] = [
    { id: 1, date: '2025-06-15', patientName: 'Juan Pérez', patientId: 1, time: '10:00 AM', notes: 'Consulta de rutina' },
    { id: 2, date: '2025-06-15', patientName: 'María García', patientId: 2, time: '11:00 AM', notes: 'Limpieza dental' },
    { id: 3, date: '2025-06-16', patientName: 'Carlos López', patientId: 3, time: '09:30 AM', notes: 'Extracción de muela' },
    { id: 4, date: '2025-06-16', patientName: 'Ana Rodríguez', patientId: 4, time: '02:00 PM', notes: 'Ortodoncia' },
    { id: 5, date: '2025-06-17', patientName: 'Luis Martínez', patientId: 5, time: '08:00 AM', notes: 'Empaste dental' },
    { id: 6, date: '2025-06-17', patientName: 'Carmen Sánchez', patientId: 6, time: '03:30 PM', notes: 'Consulta de emergencia' },
    { id: 7, date: '2025-06-18', patientName: 'Roberto Torres', patientId: 7, time: '10:30 AM', notes: 'Blanqueamiento' },
    { id: 8, date: '2025-06-18', patientName: 'Isabel Morales', patientId: 8, time: '01:00 PM', notes: 'Revisión post-tratamiento' },
    { id: 9, date: '2025-06-19', patientName: 'Fernando Silva', patientId: 9, time: '11:30 AM', notes: 'Consulta de rutina' },
    { id: 10, date: '2025-06-19', patientName: 'Patricia Vargas', patientId: 10, time: '04:00 PM', notes: 'Endodoncia' },
    { id: 11, date: '2025-06-20', patientName: 'Juan Pérez', patientId: 1, time: '09:00 AM', notes: 'Limpieza dental' },
    { id: 12, date: '2025-06-20', patientName: 'María García', patientId: 2, time: '02:30 PM', notes: 'Consulta de ortodoncia' },
    { id: 13, date: '2025-06-21', patientName: 'Carlos López', patientId: 3, time: '10:00 AM', notes: 'Extracción de cordal' },
    { id: 14, date: '2025-06-21', patientName: 'Ana Rodríguez', patientId: 4, time: '03:00 PM', notes: 'Empaste dental' },
    { id: 15, date: '2025-07-22', patientName: 'Luis Martínez', patientId: 5, time: '08:30 AM', notes: 'Consulta de rutina' }
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

    // Buscar el nombre del paciente basado en el patientId
    const patient = this.allPatients.find(p => p.id === appointment.patientId);

    const newAppointment: Appointments = {
      ...appointment,
      id: newId,
      patientName: patient?.name || 'Paciente desconocido',
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

    // Buscar el nombre del paciente basado en el patientId
    const patient = this.allPatients.find(p => p.id === appointment.patientId);

    const updatedAppointment: Appointments = {
      ...this.appointments[index],
      ...appointment,
      id, // Mantener el ID original
      patientName: patient?.name || this.appointments[index].patientName,
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
