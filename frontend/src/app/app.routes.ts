import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { ContentComponent } from './components/content/content.component';
import { HomeComponent } from './components/home/home.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { DataSetComponent } from './components/data-set/data-set.component';
import { AuthGuard } from './guards/auth.guard';
import { ChatBotComponent } from './components/chat-bot/chat-bot.component';

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
        // data: { breadcrumb: 'Admin' },  // <-- ici
        children: [
          {
            path: '',
            component: ContentComponent,
            data: { breadcrumb: 'Admin' },  // <-- ici
            children: [
              { path: 'home', component: HomeComponent, data: { breadcrumb: 'Home' }  },
              { path: 'categories', component: CategoriesComponent, data: { breadcrumb: 'Categories' } },
              { path: 'donnees', component: DataSetComponent, data: { breadcrumb: 'Données' }  },
              { path: 'chatBot', component: ChatBotComponent, data: { breadcrumb: 'chatBot' }  },
              { path: '', redirectTo: 'home', pathMatch: 'full' }
            ]
          }
        ]
      }
    ]
  },

];
