import { Component, OnInit } from '@angular/core';
import { DataSetUploadService } from '../../services/dataSetUpload/data-set-upload.service';
import { FormsModule } from '@angular/forms';
import { DataSetThemeRequest } from '../../models/DataSetThemeRequest';
import { DataSetThemeService } from '../../services/dataSetTheme/data-set-theme.service';
import { CommonModule } from '@angular/common';
import { FileComponent } from "../../components/file/file.component";

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


  constructor(private uploadService: DataSetUploadService, private themeService: DataSetThemeService) {}

  ngOnInit(): void {
    this.themeService.getThemes().subscribe({
      next: (data) => this.themes = data,
      error: (err) => console.error('Erreur lors du chargement des thèmes:', err)
    });
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
