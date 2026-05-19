import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { BudgetsComponent } from './pages/budgets/budgets.component';
import { EpargneComponent } from './pages/epargne/epargne.component';
import { RapportsComponent } from './pages/rapports/rapports.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'budgets', component: BudgetsComponent },
      { path: 'epargne', component: EpargneComponent },
      { path: 'rapports', component: RapportsComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
