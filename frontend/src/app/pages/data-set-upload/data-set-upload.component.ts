import { Component, OnInit } from '@angular/core';
import { DataSetUploadService } from '../../services/dataSetUpload/data-set-upload.service';
import { FormsModule } from '@angular/forms';
import { DataSetThemeRequest } from '../../models/DataSetThemeRequest';
import { DataSetThemeService } from '../../services/dataSetTheme/data-set-theme.service';
import { CommonModule } from '@angular/common';
import { FileComponent } from "../../components/file/file.component";
import { AuthService } from '../../services/auth.service';
import { DataProviderOrganisationMemberService } from '../../services/dataProviderOrganisationMember/data-provider-organisation-member.service';
import { SimplifiedDataProviderOrganisationMemberResponse } from '../../models/SimplifiedDataProviderOrganisationMemberResponse';

@Component({
  selector: 'app-data-set-upload',
  imports: [FormsModule, CommonModule, FileComponent],
  templateUrl: './data-set-upload.component.html',
  styleUrl: './data-set-upload.component.css'
})
export class DataSetUploadComponent implements OnInit{
  name = '';
  description = '';
  themeUuid = '';
  dataProviderOrganisationMemberUuid = '';
  selectedFile!: File;


  themes: DataSetThemeRequest[] = [];
  userRole: string | null = null;

  constructor(private authService: AuthService, private uploadService: DataSetUploadService, private themeService: DataSetThemeService, private dataProviderOrganisationMemberService: DataProviderOrganisationMemberService) {}

ngOnInit(): void {
  this.themeService.getThemes().subscribe({
    next: (data) => this.themes = data,
    error: (err) => console.error('Erreur lors du chargement des thèmes:', err)
  });

  this.userRole = this.authService.getUserRole();

  if (this.userRole === 'ROLE_PROVIDER') {
    this.dataProviderOrganisationMemberService.getCurrentMember().subscribe({
      next: (member: SimplifiedDataProviderOrganisationMemberResponse) => {
          console.log('UUID récupéré:', member.uuid); // 👈

        this.dataProviderOrganisationMemberUuid = member.uuid;
      },
      error: (err) => console.error('Erreur lors de la récupération du membre connecté:', err)
    });
  }
}


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (!this.selectedFile || !this.name || !this.description || !this.themeUuid || !this.dataProviderOrganisationMemberUuid) {
      alert("Tous les champs sont requis.");
      return;
    }

    this.uploadService.uploadDataSet(
      this.name,
      this.description,
      this.themeUuid,
      this.dataProviderOrganisationMemberUuid,
      this.selectedFile
    ).subscribe({
      next: () => alert('Données envoyées avec succès'),
      error: (err) => {
        console.error(err);
        alert('Erreur lors de l’envoi');
      }
    });
  }
}
