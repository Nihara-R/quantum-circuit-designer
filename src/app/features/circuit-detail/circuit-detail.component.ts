import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CircuitService } from '../../core/services/circuit.service';
import { QuantumSimulatorService, SimulationResult } from '../../core/services/quantum-simulator.service';
import { QuantumCircuit } from '../../core/models/circuit';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-circuit-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmationDialogComponent],
  templateUrl: './circuit-detail.component.html',
  styleUrls: ['./circuit-detail.component.css']
})
export class CircuitDetailComponent implements OnInit {
  circuit: QuantumCircuit | undefined;
  simulationResult: SimulationResult | null = null;
  exportedCode: string = '';
  showDeleteDialog = false;
  showExportModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private circuitService: CircuitService,
    private simulatorService: QuantumSimulatorService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCircuit(Number(id));
    }
  }

  loadCircuit(id: number): void {
    this.circuit = this.circuitService.getCircuitById(id);
    if (this.circuit) {
      this.runSimulation();
    }
  }

  runSimulation(): void {
    if (this.circuit) {
      this.simulationResult = this.simulatorService.simulate(
        this.circuit.qubits,
        this.circuit.gates
      );
    }
  }

  editCircuit(): void {
    if (this.circuit) {
      this.router.navigate(['/circuits', this.circuit.id, 'edit']);
    }
  }

  confirmDelete(): void {
    this.showDeleteDialog = true;
  }

  deleteCircuit(): void {
    if (this.circuit) {
      this.circuitService.deleteCircuit(this.circuit.id);
      this.router.navigate(['/']);
    }
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
  }

  exportCircuit(): void {
    if (this.circuit) {
      this.exportedCode = this.circuitService.exportCircuit(this.circuit.id);
      this.showExportModal = true;
    }
  }

  closeExportModal(): void {
    this.showExportModal = false;
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.exportedCode);
    alert('Code copied to clipboard!');
  }

  duplicateCircuit(): void {
    if (this.circuit) {
      const duplicate = this.circuitService.duplicateCircuit(this.circuit.id);
      if (duplicate) {
        this.router.navigate(['/circuits', duplicate.id]);
      }
    }
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