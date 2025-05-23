import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { ContentComponent } from './components/content/content.component';
import { HomeComponent } from './components/home/home.component';
import { DataSetThemeComponent } from './components/dataSetTheme/dataSetTheme.component';
import { DataSetComponent } from './components/data-set/data-set.component';
import { AuthGuard } from './guards/auth.guard';
import { ChatBotComponent } from './components/chat-bot/chat-bot.component';
import { DataProviderOrganisationComponent } from './components/data-provider-organisation/data-provider-organisation.component';
import { DataProviderMemberComponent } from './components/data-provider-member/data-provider-member.component';
import { DataSetUploadComponent } from './components/data-set-upload/data-set-upload.component';
import { DataSetDownloadComponent } from './components/data-set-download/data-set-download.component';

export const routes: Routes = [
  { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' }, 
      { path: 'login', component: LoginComponent },
      {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard], 
        children: [
          {
            path: '',
            component: ContentComponent,
            data: { breadcrumb: 'Admin' },  
            children: [
              { path: 'home', component: HomeComponent, data: { breadcrumb: 'Home' }  },
              { path: 'dataSetThemes', component: DataSetThemeComponent, data: { breadcrumb: 'Themes' } },
              { 
                path: 'donnees', 
                data: { breadcrumb: 'Données' },
                children: [
                  { path: '', component: DataSetComponent, data: { breadcrumb: '' } },
                  { path: 'upload', component: DataSetUploadComponent, data: { breadcrumb: 'Upload' } },
                  { path: 'download', component: DataSetDownloadComponent, data: { breadcrumb: 'Download' } },
                ]  
              },
              { path: 'chatBot', component: ChatBotComponent, data: { breadcrumb: 'chatBot' }  },
              
              {
                path: 'producteurs',
                data: { breadcrumb: 'producteurs' },
                children: [
                  { path: 'organisations', component: DataProviderOrganisationComponent, data: { breadcrumb: 'organisations' } },
                  { path: 'members', component: DataProviderMemberComponent, data: { breadcrumb: 'members' } },
                  { path: '', redirectTo: 'organisations', pathMatch: 'full' }
                ]
              },
              { path: '', redirectTo: 'home', pathMatch: 'full' }
            ]
          }
        ]
      }
    ]
  }
];