import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './components/main/main.component';
import { ContentComponent } from './components/content/content.component';
import { HomeComponent } from './pages/home/home.component';
import { DataSetThemeComponent } from './pages/dataSetTheme/dataSetTheme.component';
import { DataSetComponent } from './pages/data-set/data-set.component';
import { AuthGuard } from './guards/auth.guard';
import { ChatBotComponent } from './pages/chat-bot/chat-bot.component';
import { DataProviderOrganisationComponent } from './pages/data-provider-organisation/data-provider-organisation.component';
import { DataProviderMemberComponent } from './pages/data-provider-member/data-provider-member.component';
import { DataSetUploadComponent } from './pages/data-set-upload/data-set-upload.component';
import { DataSetDownloadComponent } from './pages/data-set-download/data-set-download.component';
import { SignupComponent } from './pages/signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' }, 
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
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
              { path: 'chatBot', component: ChatBotComponent, data: { breadcrumb: 'ChatBot' }  },
              
              {
                path: 'producteurs',
                data: { breadcrumb: 'Producteurs' },
                children: [
                  { path: 'organisations', component: DataProviderOrganisationComponent, data: { breadcrumb: 'Organisations' } },
                  { path: 'members', component: DataProviderMemberComponent, data: { breadcrumb: 'Members' } },
                  { path: '', redirectTo: 'organisations', pathMatch: 'full' }
                ]
              },
              { path: '', redirectTo: 'home', pathMatch: 'full' }
            ]
          }
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'admin/login' }

];