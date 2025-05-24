import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataSetResponse } from '../../models/DataSetResponse';
import { DataSetDownloadService } from '../../services/dataSetDownload/data-set-download.service';
import { DataSetThemeService } from '../../services/dataSetTheme/data-set-theme.service';


@Component({
  selector: 'app-data-set-download',
  imports: [FormsModule,CommonModule],
  templateUrl: './data-set-download.component.html',
  styleUrl: './data-set-download.component.css'
})

export class DataSetDownloadComponent {
  searchTerm = '';
  datasets: DataSetResponse[] = [];
  filteredDatasets: any[] = [];
  themes: any[] = [];

  constructor(
    private dataSetService: DataSetDownloadService,
    private themeService: DataSetThemeService
  ) {}

  ngOnInit(): void {
    this.loadThemesAndDatasets();
    this.dataSetService.getAllDatasets().subscribe({
      next: data => this.datasets = data,
      error: err => console.error('Erreur lors du chargement des datasets', err)
    });
  }


  downloadDataset(dataset: DataSetResponse): void {
    const fullUrl = `http://localhost:8080/api/datasets/download/${dataset.uuid}`;
    window.open(fullUrl, '_blank');
  }


  
  loadThemesAndDatasets(): void {
    this.themeService.getThemes().subscribe(themes => {
      console.log('Thèmes récupérés du backend :', themes); // 👈 Affiche tous les thèmes

      this.themes = themes;

      this.dataSetService.getAllDatasets().subscribe(datasets => {
        console.log('Datasets récupérés du backend :', datasets); // 👈 Facultatif

        this.datasets = datasets.map(dataset => {
          // Affiche chaque correspondance tentative
          const matchedTheme = this.themes.find(t => t.uuid === dataset.themeUuid);
          console.log(`Dataset [${dataset.name}] - themeId: ${dataset.themeId} - theme trouvé:`, matchedTheme);

          return {
            ...dataset,
            themeName: matchedTheme ? matchedTheme.name : 'Inconnu'
          };
        });

        this.filteredDatasets = [...this.datasets];
      });
    });
  }


}