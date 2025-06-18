import { Component, OnInit } from '@angular/core';
import { Patient } from '../../models/Patient.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './personalInformation.component.html',
  styleUrls: ['./personalInformation.component.scss']
})
export class PersonalInformationComponent implements OnInit {
  patient: Patient = {
    id: 1,
    name: 'Juan Pérez',
    dni: '12345678',
    birthDate: '1988-01-01',
    phone: '+1 234 567 890',
    address: 'Calle Principal #123',
    email: 'juan@example.com',
    gender: 'male',
    occupation: 'Ingeniero',
    landlinePhone: null,
    legalGuardianName: null,
    legalGuardianDni: null,
    age: 35,
  };

  constructor() {}

  ngOnInit(): void {
  }
}
