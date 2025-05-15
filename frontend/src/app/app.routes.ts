import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { ContentComponent } from './components/content/content.component';
import { HomeComponent } from './components/home/home.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { DataSetComponent } from './components/data-set/data-set.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // ✅ Ajout important ici
      { path: 'login', component: LoginComponent },
      {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard], // ✅ PROTECTION
        children: [
          {
            path: '',
            component: ContentComponent,
            children: [
              { path: 'home', component: HomeComponent },
              { path: 'categories', component: CategoriesComponent },
              { path: 'donnees', component: DataSetComponent },
              { path: '', redirectTo: 'home', pathMatch: 'full' }
            ]
          }
        ]
      }
    ]
  },

];
