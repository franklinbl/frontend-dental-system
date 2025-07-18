import { Component, OnInit, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tooth-record',
  standalone: true,
  imports: [NgClass],
  templateUrl: './tooth-record.component.html',
  styleUrls: ['./tooth-record.component.scss']
})
export class ToothRecordComponent implements OnInit {
  patientId = input<string | null>();
  odontogramaSeleccionados: number[] = [];

  constructor() {}

  ngOnInit(): void {
  }

  toggleDiente(numero: number): void {
    const idx = this.odontogramaSeleccionados.indexOf(numero);
    if (idx === -1) {
      this.odontogramaSeleccionados.push(numero);
    } else {
      this.odontogramaSeleccionados.splice(idx, 1);
    }
    // Ordenar para mostrar siempre en orden
    this.odontogramaSeleccionados.sort((a, b) => a - b);
  }
}
