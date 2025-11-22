import { Injectable } from '@angular/core';
import { QuantumGate } from '../models/circuit';

export interface SimulationResult {
  states: { [key: string]: number };
  probabilities: { [key: string]: number };
  visualization: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuantumSimulatorService {
  
  simulate(numQubits: number, gates: QuantumGate[]): SimulationResult {
    const stateSize = Math.pow(2, numQubits);
    let state = this.initializeState(stateSize);

    gates.forEach(gate => {
      state = this.applyGate(state, gate, numQubits);
    });

    const probabilities = this.calculateProbabilities(state);
    
    return {
      states: state,
      probabilities,
      visualization: this.generateVisualization(probabilities, numQubits)
    };
  }

  private initializeState(size: number): { [key: string]: number } {
    const state: { [key: string]: number } = {};
    state['0'.repeat(Math.log2(size))] = 1.0;
    return state;
  }

  private applyGate(
    state: { [key: string]: number },
    gate: QuantumGate,
    numQubits: number
  ): { [key: string]: number } {
    switch (gate.type) {
      case 'H':
        return this.applyHadamard(state, gate.qubitIndex, numQubits);
      case 'X':
        return this.applyPauliX(state, gate.qubitIndex, numQubits);
      case 'CNOT':
        return this.applyCNOT(state, gate.controlQubit!, gate.qubitIndex, numQubits);
      default:
        return state;
    }
  }

  private applyHadamard(
    state: { [key: string]: number },
    qubitIndex: number,
    numQubits: number
  ): { [key: string]: number } {
    const newState: { [key: string]: number } = {};
    const factor = 1 / Math.sqrt(2);

    Object.keys(state).forEach(key => {
      const amplitude = state[key];
      const bits = key.split('');
      
      if (bits[qubitIndex] === '0') {
        const key0 = key;
        const key1 = bits.map((b, i) => i === qubitIndex ? '1' : b).join('');
        newState[key0] = (newState[key0] || 0) + amplitude * factor;
        newState[key1] = (newState[key1] || 0) + amplitude * factor;
      } else {
        const key0 = bits.map((b, i) => i === qubitIndex ? '0' : b).join('');
        const key1 = key;
        newState[key0] = (newState[key0] || 0) + amplitude * factor;
        newState[key1] = (newState[key1] || 0) - amplitude * factor;
      }
    });

    return newState;
  }

  private applyPauliX(
    state: { [key: string]: number },
    qubitIndex: number,
    numQubits: number
  ): { [key: string]: number } {
    const newState: { [key: string]: number } = {};

    Object.keys(state).forEach(key => {
      const bits = key.split('');
      bits[qubitIndex] = bits[qubitIndex] === '0' ? '1' : '0';
      const newKey = bits.join('');
      newState[newKey] = state[key];
    });

    return newState;
  }

  private applyCNOT(
    state: { [key: string]: number },
    controlQubit: number,
    targetQubit: number,
    numQubits: number
  ): { [key: string]: number } {
    const newState: { [key: string]: number } = {};

    Object.keys(state).forEach(key => {
      const bits = key.split('');
      
      if (bits[controlQubit] === '1') {
        bits[targetQubit] = bits[targetQubit] === '0' ? '1' : '0';
      }
      
      const newKey = bits.join('');
      newState[newKey] = state[key];
    });

    return newState;
  }

  private calculateProbabilities(state: { [key: string]: number }): { [key: string]: number } {
    const probabilities: { [key: string]: number } = {};

    Object.keys(state).forEach(key => {
      const amplitude = state[key];
      probabilities[key] = Math.pow(amplitude, 2);
    });

    return probabilities;
  }

  private generateVisualization(probabilities: { [key: string]: number }, numQubits: number): string {
    let viz = 'Measurement Probabilities:\n\n';
    
    Object.keys(probabilities)
      .sort()
      .forEach(key => {
        const prob = probabilities[key];
        if (prob > 0.001) {
          const percentage = (prob * 100).toFixed(2);
          const bar = '█'.repeat(Math.floor(prob * 50));
          viz += `|${key}⟩: ${percentage}% ${bar}\n`;
        }
      });

    return viz;
  }

  getExpectedOutput(gates: QuantumGate[], numQubits: number): string {
    const gateTypes = gates.map(g => g.type).join('-');

    if (numQubits === 2 && gateTypes === 'H-CNOT') {
      return 'Bell State: 50% |00⟩ + 50% |11⟩ (Entangled)';
    }
    if (numQubits === 1 && gateTypes === 'H') {
      return 'Superposition: 50% |0⟩ + 50% |1⟩';
    }
    if (gates.some(g => g.type === 'X')) {
      return 'Qubit flip detected';
    }

    return 'Custom circuit - run simulation to see results';
  }
}