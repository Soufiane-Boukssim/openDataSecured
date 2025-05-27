import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataSetDownload } from '../../models/DataSetDownload';
import { DataSetDownloadService } from '../../services/dataSetDownload/data-set-download.service';
import { DataSetThemeService } from '../../services/dataSetTheme/data-set-theme.service';


declare var bootstrap: any; // Important si tu utilises Bootstrap 5 sans TypeScript support


@Component({
  selector: 'app-data-set-download',
  imports: [FormsModule,CommonModule],
  templateUrl: './data-set-download.component.html',
  styleUrl: './data-set-download.component.css'
})

export class DataSetDownloadComponent {
  searchTerm: string = '';

  datasets: DataSetDownload[] = [];
  selectedDataset: DataSetDownload | null = null;
  
  filteredDatasets: DataSetDownload[] = [];
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

        // this.datasets = datasets.map(dataset => {
        //   // Affiche chaque correspondance tentative
        //   const matchedTheme = this.themes.find(t => t.uuid === dataset.themeUuid);
        //   console.log(`Dataset [${dataset.name}] - themeId: ${dataset.themeId} - theme trouvé:`, matchedTheme);

        //   return {
        //     ...dataset,
        //     themeName: matchedTheme ? matchedTheme.name : 'Inconnu'
        //   };
        // });
        this.datasets = datasets;
        this.filteredDatasets = [...this.datasets];


        // this.filteredDatasets = [...this.datasets];
      });
    });
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredDatasets = [...this.datasets]; // Affiche tous les datasets si la recherche est vide
    } else {
      this.filteredDatasets = this.datasets.filter(dataset =>
        dataset.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        dataset.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }


  viewDataset(uuid: string) {
    const found = this.datasets.find(d => d.uuid === uuid);
    if (found) {
      this.selectedDataset = found;
      const modalElement = document.getElementById('themeModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }

  updateDataset(dataset: DataSetDownload): void {
    console.log('Updating dataset:', dataset);
  }





//   selectedDataset: DataSetDownload | null = null;


  openDeletePopup(dataset: DataSetDownload): void {
    this.selectedDataset = dataset;

    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
  }

confirmDelete(): void {
  if (!this.selectedDataset) return;

  const datasetToDelete = this.selectedDataset;

  this.dataSetService.deleteDataset(datasetToDelete.uuid).subscribe({
    next: (success) => {
      if (success) {
        this.filteredDatasets = this.filteredDatasets.filter(
          d => d.uuid !== datasetToDelete.uuid
        );
        alert(`Le dataset "${datasetToDelete.uuid}" a été supprimé.`);
      } else {
        alert('Échec de la suppression.');
      }
      this.selectedDataset = null;
    },
    error: (err) => {
      console.error('Erreur lors de la suppression', err);
      alert('Erreur lors de la suppression du dataset.');
      this.selectedDataset = null;
    }
  });

  // Fermer le modal
  const modalElement = document.getElementById('confirmDeleteModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance?.hide(); // Ajoute aussi ?. ici pour éviter une erreur si le modal est null
}


downloadFile(dataset: DataSetDownload): void {
  const downloadUrl = `${this.dataSetService.getBaseDownloadUrl()}/${dataset.uuid}`;
  window.open(downloadUrl, '_blank');
}

}