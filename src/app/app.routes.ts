import { Routes } from '@angular/router';
import { CircuitListComponent } from './features/circuit-list/circuit-list.component';
import { CircuitBuilderComponent } from './features/circuit-builder/circuit-builder.component';
import { CircuitDetailComponent } from './features/circuit-detail/circuit-detail.component';
import { AlgorithmLibraryComponent } from './features/algorithm-library/algorithm-library.component';

export const routes: Routes = [
  {
    path: '',
    component: CircuitListComponent,
    title: 'Dashboard - Quantum Circuit Designer'
  },
  {
    path: 'circuits/new',
    component: CircuitBuilderComponent,
    title: 'New Circuit - Quantum Circuit Designer'
  },
  {
    path: 'circuits/:id',
    component: CircuitDetailComponent,
    title: 'Circuit Details - Quantum Circuit Designer'
  },
  {
    path: 'circuits/:id/edit',
    component: CircuitBuilderComponent,
    title: 'Edit Circuit - Quantum Circuit Designer'
  },
  {
    path: 'library',
    component: AlgorithmLibraryComponent,
    title: 'Algorithm Library - Quantum Circuit Designer'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];