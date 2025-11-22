import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CircuitService } from '../../core/services/circuit.service';
import { QuantumCircuit } from '../../core/models/circuit';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FilterPipe } from '../../shared/pipes/filter.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-circuit-list',
  standalone: true,
  imports: [CommonModule, RouterModule, StatsCardComponent, ConfirmationDialogComponent, FilterPipe, FormsModule],
  templateUrl: './circuit-list.component.html',
  styleUrls: ['./circuit-list.component.css']
})
export class CircuitListComponent implements OnInit {
  circuits: QuantumCircuit[] = [];
  statistics: any;
  searchText: string = '';
  showDeleteDialog = false;
  circuitToDelete: number | null = null;

  constructor(
    private circuitService: CircuitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCircuits();
    this.loadStatistics();
    
    this.circuitService.circuits$.subscribe(circuits => {
      this.circuits = circuits;
      this.loadStatistics();
    });
  }

  loadCircuits(): void {
    this.circuits = this.circuitService.getCircuits();
  }
  loadStatistics(): void {
    this.statistics = this.circuitService.getStatistics();
  }

  viewCircuit(id: number): void {
    this.router.navigate(['/circuits', id]);
  }

  editCircuit(id: number): void {
    this.router.navigate(['/circuits', id, 'edit']);
  }

  confirmDelete(id: number): void {
    this.circuitToDelete = id;
    this.showDeleteDialog = true;
  }
deleteCircuit(): void {
    if (this.circuitToDelete) {
      this.circuitService.deleteCircuit(this.circuitToDelete);
      this.showDeleteDialog = false;
      this.circuitToDelete = null;
    }
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.circuitToDelete = null;
  }

  duplicateCircuit(id: number): void {
    this.circuitService.duplicateCircuit(id);
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

  getStatusIcon(status: string): string {
    const icons: any = {
      'Completed': '✓',
      'In Progress': '◐',
      'Draft': '○',
      'Verified': '✓✓',
      'Archived': '□'
    };
    return icons[status] || '○';
  }
}
