export interface QuantumCircuit {
  id: number;
  name: string;
  description: string;
  qubits: number;
  gates: QuantumGate[];
  category: CircuitCategory;
  difficulty: CircuitDifficulty;
  status: CircuitStatus;
  expectedOutput?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  author?: string;
  isPublic?: boolean;
}

export interface QuantumGate {
  id: string;
  type: GateType;
  qubitIndex: number;
  position: number;
  controlQubit?: number;
  targetQubit?: number;
  parameter?: number;
}

export type GateType = 
  | 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' 
  | 'CNOT' | 'SWAP' | 'Toffoli' 
  | 'RX' | 'RY' | 'RZ' | 'M';

export type CircuitCategory = 
  | 'Algorithm' | 'Tutorial' | 'Experiment' | 'Research' | 'Game';

export type CircuitDifficulty = 
  | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type CircuitStatus = 
  | 'Draft' | 'In Progress' | 'Completed' | 'Verified' | 'Archived';

export interface GateInfo {
  type: GateType;
  name: string;
  symbol: string;
  color: string;
  description: string;
}

export const GATE_LIBRARY: GateInfo[] = [
  { type: 'H', name: 'Hadamard', symbol: 'H', color: '#3b82f6', 
    description: 'Creates superposition - equal probability of |0⟩ and |1⟩' },
  { type: 'X', name: 'Pauli-X', symbol: 'X', color: '#ef4444', 
    description: 'Quantum NOT gate - flips |0⟩ to |1⟩' },
  { type: 'Y', name: 'Pauli-Y', symbol: 'Y', color: '#f59e0b', 
    description: 'Rotation around Y-axis of Bloch sphere' },
  { type: 'Z', name: 'Pauli-Z', symbol: 'Z', color: '#8b5cf6', 
    description: 'Phase flip gate - adds π phase to |1⟩' },
  { type: 'S', name: 'Phase', symbol: 'S', color: '#06b6d4', 
    description: 'Adds π/2 phase shift' },
  { type: 'T', name: 'T Gate', symbol: 'T', color: '#ec4899', 
    description: 'Adds π/4 phase shift' },
  { type: 'CNOT', name: 'Controlled-NOT', symbol: '⊕', color: '#10b981', 
    description: 'Flips target qubit if control is |1⟩' },
  { type: 'SWAP', name: 'Swap', symbol: '×', color: '#f97316', 
    description: 'Swaps states of two qubits' }
];