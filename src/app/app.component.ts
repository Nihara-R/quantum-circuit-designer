// src/app/app.component.ts
// Import your service and model interfaces (already generated)
import { QuantumCircuit } from './core/models/circuit';
import { QuantumGateModel } from './core/models/quantum-gate.model'; 

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Quantum Circuit Designer';
}