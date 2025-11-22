import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuantumCircuit } from '../models/circuit';

@Injectable({
  providedIn: 'root'
})
export class CircuitService {
  private readonly STORAGE_KEY = 'quantum_circuits';
  private circuitsSubject = new BehaviorSubject<QuantumCircuit[]>(this.getCircuits());
  public circuits$ = this.circuitsSubject.asObservable();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const sampleCircuits: QuantumCircuit[] = [
        {
          id: Date.now(),
          name: 'Bell State Creator',
          description: 'Creates quantum entanglement between two qubits using Hadamard and CNOT gates',
          qubits: 2,
          gates: [
            { id: 'g1', type: 'H', qubitIndex: 0, position: 1 },
            { id: 'g2', type: 'CNOT', qubitIndex: 1, position: 2, controlQubit: 0 }
          ],
          category: 'Algorithm',
          difficulty: 'Beginner',
          status: 'Completed',
          expectedOutput: '|00⟩ + |11⟩ (Entangled state)',
          notes: 'Foundation of quantum communication and teleportation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'You',
          isPublic: false
        },
        {
          id: Date.now() + 1,
          name: 'Quantum Superposition',
          description: 'Demonstrates superposition by applying Hadamard gate to single qubit',
          qubits: 1,
          gates: [
            { id: 'g3', type: 'H', qubitIndex: 0, position: 1 }
          ],
          category: 'Tutorial',
          difficulty: 'Beginner',
          status: 'Completed',
          expectedOutput: '50% |0⟩ and 50% |1⟩',
          notes: 'Fundamental concept in quantum computing',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'You',
          isPublic: false
        },
        {
          id: Date.now() + 2,
          name: 'Deutsch Algorithm',
          description: 'First quantum algorithm showing computational advantage over classical',
          qubits: 2,
          gates: [
            { id: 'g4', type: 'X', qubitIndex: 1, position: 1 },
            { id: 'g5', type: 'H', qubitIndex: 0, position: 2 },
            { id: 'g6', type: 'H', qubitIndex: 1, position: 2 }
          ],
          category: 'Algorithm',
          difficulty: 'Intermediate',
          status: 'In Progress',
          expectedOutput: 'Determines if function is constant or balanced',
          notes: 'Historical significance in quantum computing',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'You',
          isPublic: false
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleCircuits));
      this.circuitsSubject.next(sampleCircuits);
    }
  }

  addCircuit(circuit: Omit<QuantumCircuit, 'id' | 'createdAt' | 'updatedAt'>): QuantumCircuit {
    const circuits = this.getCircuits();
    const newCircuit: QuantumCircuit = {
      ...circuit,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    circuits.push(newCircuit);
    this.saveCircuits(circuits);
    return newCircuit;
  }

  getCircuits(): QuantumCircuit[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  getCircuitById(id: number): QuantumCircuit | undefined {
    return this.getCircuits().find(c => c.id === id);
  }

  updateCircuit(updatedCircuit: QuantumCircuit): boolean {
    const circuits = this.getCircuits();
    const index = circuits.findIndex(c => c.id === updatedCircuit.id);
    
    if (index > -1) {
      circuits[index] = {
        ...updatedCircuit,
        updatedAt: new Date().toISOString()
      };
      this.saveCircuits(circuits);
      return true;
    }
    return false;
  }

  deleteCircuit(id: number): boolean {
    const circuits = this.getCircuits();
    const filteredCircuits = circuits.filter(c => c.id !== id);
    
    if (filteredCircuits.length < circuits.length) {
      this.saveCircuits(filteredCircuits);
      return true;
    }
    return false;
  }

  private saveCircuits(circuits: QuantumCircuit[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(circuits));
    this.circuitsSubject.next(circuits);
  }

  duplicateCircuit(id: number): QuantumCircuit | null {
    const circuit = this.getCircuitById(id);
    if (!circuit) return null;

    const duplicate: Omit<QuantumCircuit, 'id' | 'createdAt' | 'updatedAt'> = {
      ...circuit,
      name: `${circuit.name} (Copy)`,
      status: 'Draft'
    };
    
    return this.addCircuit(duplicate);
  }

  getStatistics() {
    const circuits = this.getCircuits();
    return {
      total: circuits.length,
      completed: circuits.filter(c => c.status === 'Completed').length,
      inProgress: circuits.filter(c => c.status === 'In Progress').length,
      draft: circuits.filter(c => c.status === 'Draft').length,
      byDifficulty: {
        beginner: circuits.filter(c => c.difficulty === 'Beginner').length,
        intermediate: circuits.filter(c => c.difficulty === 'Intermediate').length,
        advanced: circuits.filter(c => c.difficulty === 'Advanced').length,
        expert: circuits.filter(c => c.difficulty === 'Expert').length
      },
      byCategory: {
        algorithm: circuits.filter(c => c.category === 'Algorithm').length,
        tutorial: circuits.filter(c => c.category === 'Tutorial').length,
        experiment: circuits.filter(c => c.category === 'Experiment').length,
        research: circuits.filter(c => c.category === 'Research').length
      },
      totalQubits: circuits.reduce((sum, c) => sum + c.qubits, 0),
      totalGates: circuits.reduce((sum, c) => sum + c.gates.length, 0)
    };
  }

  searchCircuits(query: string): QuantumCircuit[] {
    const lowerQuery = query.toLowerCase();
    return this.getCircuits().filter(circuit =>
      circuit.name.toLowerCase().includes(lowerQuery) ||
      circuit.description.toLowerCase().includes(lowerQuery) ||
      circuit.category.toLowerCase().includes(lowerQuery) ||
      circuit.notes?.toLowerCase().includes(lowerQuery)
    );
  }

  clearAllCircuits(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.circuitsSubject.next([]);
  }

  exportCircuit(id: number): string {
    const circuit = this.getCircuitById(id);
    if (!circuit) return '';
    
    let code = `# ${circuit.name}\n`;
    code += `# ${circuit.description}\n\n`;
    code += `from qiskit import QuantumCircuit\n\n`;
    code += `qc = QuantumCircuit(${circuit.qubits})\n\n`;
    
    circuit.gates.forEach(gate => {
      if (gate.type === 'CNOT') {
        code += `qc.cx(${gate.controlQubit}, ${gate.qubitIndex})\n`;
      } else {
        code += `qc.${gate.type.toLowerCase()}(${gate.qubitIndex})\n`;
      }
    });
    
    code += `\nqc.measure_all()\n`;
    return code;
  }
}