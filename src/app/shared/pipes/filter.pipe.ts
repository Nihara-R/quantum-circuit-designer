import { Pipe, PipeTransform } from '@angular/core';
import { QuantumCircuit } from '../../core/models/circuit';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(circuits: QuantumCircuit[], searchText: string): QuantumCircuit[] {
    if (!circuits || !searchText) {
      return circuits;
    }

    searchText = searchText.toLowerCase();

    return circuits.filter(circuit =>
      circuit.name.toLowerCase().includes(searchText) ||
      circuit.description.toLowerCase().includes(searchText) ||
      circuit.category.toLowerCase().includes(searchText) ||
      circuit.difficulty.toLowerCase().includes(searchText) ||
      circuit.status.toLowerCase().includes(searchText)
    );
  }
}