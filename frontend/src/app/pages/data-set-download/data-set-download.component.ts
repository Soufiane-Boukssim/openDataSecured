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

  viewDataset(dataset: DataSetResponse): void {
    console.log('Viewing dataset:', dataset);
  }

  updateDataset(dataset: DataSetResponse): void {
    console.log('Updating dataset:', dataset);
  }

  deleteDataset(dataset: DataSetResponse): void {
    const confirmed = confirm(`Voulez-vous vraiment supprimer "${dataset.name}" ?`);
    if (confirmed) {
      this.dataSetService.deleteDataset(dataset.uuid).subscribe({
        next: (success) => {
          if (success) {
            // Supprimer localement de la liste affichée
            this.filteredDatasets = this.filteredDatasets.filter(d => d.uuid !== dataset.uuid);
            alert(`Le dataset "${dataset.name}" a été supprimé.`);
          } else {
            alert('Échec de la suppression.');
          }
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          alert('Erreur lors de la suppression du dataset.');
        }
      });
    }
  }

}