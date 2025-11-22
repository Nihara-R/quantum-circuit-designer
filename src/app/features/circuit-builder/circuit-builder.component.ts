import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CircuitService } from '../../core/services/circuit.service';
import { QuantumSimulatorService, SimulationResult } from '../../core/services/quantum-simulator.service';
import { QuantumCircuit, GATE_LIBRARY, GateInfo } from '../../core/models/circuit';

@Component({
  selector: 'app-circuit-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './circuit-builder.component.html',
  styleUrls: ['./circuit-builder.component.css']
})
export class CircuitBuilderComponent implements OnInit {
  circuitForm!: FormGroup;
  gateLibrary = GATE_LIBRARY;
  selectedGate: string | null = null;
  isEditMode = false;
  circuitId: number | null = null;
  simulationResult: SimulationResult | null = null;
  showSimulation = false;

  constructor(
    private fb: FormBuilder,
    private circuitService: CircuitService,
    private simulatorService: QuantumSimulatorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.circuitForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      qubits: [2, [Validators.required, Validators.min(1), Validators.max(5)]],
      category: ['Algorithm', Validators.required],
      difficulty: ['Beginner', Validators.required],
      status: ['Draft', Validators.required],
      expectedOutput: [''],
      notes: ['']
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.circuitId = Number(id);
      this.loadCircuit(this.circuitId);
    }
  }

  loadCircuit(id: number): void {
    const circuit = this.circuitService.getCircuitById(id);
    if (circuit) {
      this.circuitForm.patchValue(circuit);
    }
  }

  selectGate(gateType: string): void {
    this.selectedGate = gateType;
  }

  saveCircuit(): void {
    if (this.circuitForm.valid) {
      const circuitData = {
        ...this.circuitForm.value,
        gates: [],
        author: 'You',
        isPublic: false
      };

      if (this.isEditMode && this.circuitId) {
        const existingCircuit = this.circuitService.getCircuitById(this.circuitId);
        if (existingCircuit) {
          this.circuitService.updateCircuit({
            ...existingCircuit,
            ...circuitData
          });
        }
      } else {
        this.circuitService.addCircuit(circuitData);
      }

      this.router.navigate(['/']);
    }
  }

  simulateCircuit(): void {
    const qubits = this.circuitForm.get('qubits')?.value || 2;
    const gates = [
      { id: 'g1', type: 'H', qubitIndex: 0, position: 1 },
      { id: 'g2', type: 'CNOT', qubitIndex: 1, position: 2, controlQubit: 0 }
    ];

    this.simulationResult = this.simulatorService.simulate(qubits, gates as any);
    this.showSimulation = true;
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  get formControls() {
    return this.circuitForm.controls;
  }
}
