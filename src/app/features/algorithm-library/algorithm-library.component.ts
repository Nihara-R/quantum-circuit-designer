import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CircuitService } from '../../core/services/circuit.service';

@Component({
  selector: 'app-algorithm-library',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './algorithm-library.component.html',
  styleUrls: ['./algorithm-library.component.css']
})
export class AlgorithmLibraryComponent {
  algorithms = [
    {
      name: 'Bell State',
      description: 'Creates quantum entanglement between two qubits',
      qubits: 2,
      difficulty: 'Beginner',
      useCase: 'Foundation for quantum communication and teleportation'
    },
    {
      name: 'Quantum Superposition',
      description: 'Places a qubit in equal superposition of |0⟩ and |1⟩',
      qubits: 1,
      difficulty: 'Beginner',
      useCase: 'Fundamental quantum state for quantum computing'
    },
    {
      name: 'Deutsch-Jozsa Algorithm',
      description: 'Determines if a function is constant or balanced',
      qubits: 3,
      difficulty: 'Intermediate',
      useCase: 'First algorithm showing quantum computational advantage'
    },
    {
      name: "Grover's Search",
      description: 'Quantum search algorithm with quadratic speedup',
      qubits: 4,
      difficulty: 'Advanced',
      useCase: 'Database search and optimization problems'
    },
    {
      name: 'Quantum Teleportation',
      description: 'Transmits quantum state using entanglement',
      qubits: 3,
      difficulty: 'Advanced',
      useCase: 'Quantum communication protocols'
    },
    {
      name: 'Quantum Fourier Transform',
      description: 'Quantum version of discrete Fourier transform',
      qubits: 4,
      difficulty: 'Expert',
      useCase: 'Key component in Shor\'s algorithm'
    }
  ];

  constructor(
    private circuitService: CircuitService,
    private router: Router
  ) {}

  createFromTemplate(algorithm: any): void {
    alert(`Creating ${algorithm.name} circuit template...`);
    this.router.navigate(['/circuits/new']);
  }

  getDifficultyClass(difficulty: string): string {
    const classes: any = {
      'Beginner': 'difficulty-beginner',
      'Intermediate': 'difficulty-intermediate',
      'Advanced': 'difficulty-advanced',
      'Expert': 'difficulty-expert'
    };
    return classes[difficulty] || 'difficulty-beginner';
  }
}