// D:\bureau2025\openDataSecured\frontend\src\app\data-set-download\data-set-download.component.ts

import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataSetDownload } from '../../models/DataSetDownload';
import { DataSetDownloadService } from '../../services/dataSetDownload/data-set-download.service';
import { DataSetThemeService } from '../../services/dataSetTheme/data-set-theme.service';
import { FileComponent } from '../../components/file/file.component';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { LeafletMapComponent } from "../../components/leaflet-map/leaflet-map.component";


declare var bootstrap: any;

@Component({
  selector: 'app-data-set-download',
  imports: [FormsModule, CommonModule, FileComponent, NgChartsModule, LeafletMapComponent],
  templateUrl: './data-set-download.component.html',
  styleUrl: './data-set-download.component.css'
})
export class DataSetDownloadComponent {
  @ViewChild(LeafletMapComponent) leafletMapComponent!: LeafletMapComponent; // Reference to the child map component

  searchTerm: string = '';
  datasets: DataSetDownload[] = [];
  selectedDataset: DataSetDownload | null = null;
  filteredDatasets: DataSetDownload[] = [];
  themes: any[] = [];

  // Variables pour la mise à jour
  updateData = {
    name: '',
    description: '',
    themeUuid: '',
    dataProviderOrganisationMemberUuid: '',
    file: null as File | null
  };
  isUpdating = false;

  tableData: any[][] = [];

  // NOUVEAU: Propriété pour stocker les villes filtrées à passer au composant carte
  citiesForMap: { name: string; coords: L.LatLngTuple }[] = [];
  currentDatasetId?: number; // Déplacé ici pour être accessible globalement dans la classe

  constructor(
    private dataSetService: DataSetDownloadService,
    private themeService: DataSetThemeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadThemesAndDatasets();
  }

  loadThemesAndDatasets(): void {
    this.themeService.getThemes().subscribe(themes => {
      console.log('Thèmes récupérés du backend :', themes);
      this.themes = themes;

      this.dataSetService.getAllDatasets().subscribe(datasets => {
        console.log('Datasets récupérés du backend :', datasets);
        this.datasets = datasets;
        this.filteredDatasets = [...this.datasets];
      });
    });
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredDatasets = [...this.datasets];
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

  openUpdateModal(dataset: DataSetDownload): void {
    this.selectedDataset = dataset;

    this.updateData = {
      name: dataset.name,
      description: dataset.description,
      themeUuid: dataset.dataSetTheme.uuid,
      file: null,
      dataProviderOrganisationMemberUuid: ''
    };

    const modal = new bootstrap.Modal(document.getElementById('updateModal'));
    modal.show();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel') {
        this.updateData.file = file;
      } else {
        alert('Veuillez sélectionner un fichier Excel (.xlsx ou .xls)');
        event.target.value = '';
      }
    }
  }

  confirmUpdate(): void {
    if (!this.selectedDataset) return;

    this.isUpdating = true;

    const name = this.updateData.name !== this.selectedDataset.name ? this.updateData.name : undefined;
    const description = this.updateData.description !== this.selectedDataset.description ? this.updateData.description : undefined;
    const themeUuid = this.updateData.themeUuid !== this.selectedDataset.dataSetTheme.uuid ? this.updateData.themeUuid : undefined;

    this.dataSetService.updateDataset(
      this.selectedDataset.uuid,
      name,
      description,
      themeUuid,
      this.selectedDataset.dataProviderOrganisationMember.uuid,
      this.updateData.file || undefined
    ).subscribe({
      next: (updatedDataset) => {
        console.log('Dataset mis à jour avec succès:', updatedDataset);

        const index = this.datasets.findIndex(d => d.uuid === updatedDataset.uuid);
        if (index !== -1) {
          this.datasets[index] = updatedDataset;
          this.applyFilter();
        }

        alert(`Le dataset "${updatedDataset.name}" a été mis à jour avec succès.`);

        const modalElement = document.getElementById('updateModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();

        this.resetUpdateForm();
        this.isUpdating = false;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour:', err);
        let errorMessage = 'Erreur lors de la mise à jour du dataset.';

        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }

        alert(errorMessage);
        this.isUpdating = false;
      }
    });
  }

  resetUpdateForm(): void {
    this.updateData = {
      name: '',
      description: '',
      themeUuid: '',
      file: null,
      dataProviderOrganisationMemberUuid: '',
    };
    this.selectedDataset = null;
  }

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
          this.datasets = this.datasets.filter(
            d => d.uuid !== datasetToDelete.uuid
          );
          alert(`Le dataset "${datasetToDelete.name}" a été supprimé.`);
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

    const modalElement = document.getElementById('confirmDeleteModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance?.hide();
  }

  downloadTemplate(datasetId: number) {
    this.dataSetService.downloadTemplate(datasetId).subscribe(response => {
      const blob = new Blob([response.body!], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'template.xlsx';
      if (contentDisposition) {
        const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  viewAsTable(datasetId: number): void {
    this.dataSetService.downloadTemplate(datasetId).subscribe((response) => {
      const blob = response.body as Blob;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        this.tableData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const tableModal = new bootstrap.Modal(document.getElementById('tableModal')!);
        tableModal.show();
      };
      reader.readAsArrayBuffer(blob);
    });
  }


  // Chart.js properties
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data']['datasets'] = [];

  // showLeafletMap: boolean = false; // Cette propriété n'est plus nécessaire avec la nouvelle approche

  viewAsChart(datasetId: number, theme: string): void {
    const lowerTheme = theme.toLowerCase();
    if (lowerTheme === 'finance') {
      this.visualizeFinanceDataset(datasetId);
    }
    else if (lowerTheme === 'environnement') {
      this.currentDatasetId = datasetId; // S'assurer que l'ID est bien défini
      this.visualizeEnvironmentDataset(datasetId); // IMPORTANT: Passez datasetId
    }
    else if (lowerTheme === 'sport') {
      this.currentDatasetId = datasetId; // S'assurer que l'ID est bien défini
      this.visualizeSportDataset(datasetId);
    }
  }

  visualizeFinanceDataset(datasetId: number): void {
    this.dataSetService.downloadTemplate(datasetId).subscribe((response) => {
      const blob = response.body as Blob;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headers = rows[0] as string[];
        const anneeIndex = headers.indexOf('Année budgétaire');
        const montantIndex = headers.indexOf('Montant voté');
        const chartLabels: string[] = [];
        const chartData: number[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i] as any[];
          const annee = row[anneeIndex];
          const montant = row[montantIndex];
          if (annee && montant) {
            chartLabels.push(String(annee));
            chartData.push(Number(montant));
          }
        }
        this.barChartLabels = chartLabels;
        this.barChartData = [{ data: chartData, label: 'Montant voté par année budgétaire' }];
        const modal = new bootstrap.Modal(document.getElementById('chartModal')!);
        modal.show();
      };
      reader.readAsArrayBuffer(blob);
    });
  }

  visualizeSportDataset(datasetId: number): void {
    this.dataSetService.downloadTemplate(datasetId).subscribe((response) => {
      const blob = response.body as Blob;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rows.length === 0) {
          alert('Le fichier Excel est vide.');
          return;
        }

        const headers = rows[0] as string[];
        const villeIndex = headers.indexOf('Localisation');
        if (villeIndex === -1) {
          alert("La colonne 'Localisation' n'a pas été trouvée.");
          return;
        }

        const excelCitiesNames: Set<string> = new Set();
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i] as any[];
          if (row && row.length > villeIndex && row[villeIndex] !== undefined && row[villeIndex] !== null) {
            const cityName = String(row[villeIndex]).trim();
            if (cityName) {
              excelCitiesNames.add(cityName.toLowerCase());
            }
          }
        }

        if (!this.leafletMapComponent) {
          console.error("LeafletMapComponent n'est pas encore disponible.");
          alert("Erreur interne: Le composant de carte n'est pas prêt.");
          return;
        }
        const allCities = this.leafletMapComponent.getAllMoroccanCities();

        this.citiesForMap = allCities.filter(city =>
          excelCitiesNames.has(city.name.toLowerCase())
        ).map(city => ({
          name: city.name,
          coords: [city.coords[0], city.coords[1]] // Crée une nouvelle instance de coordonnées
        }));

        console.log('Villes filtrées pour la carte :', this.citiesForMap); // AJOUTÉ

        const modalElement = document.getElementById('leafletMapModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();

          modalElement.addEventListener('shown.bs.modal', () => {
            if (this.leafletMapComponent) {
              this.leafletMapComponent.initializeMap();
            }
          }, { once: true });
        }
      };
      reader.readAsArrayBuffer(blob);
    }, error => {
      console.error('Erreur lors du téléchargement du fichier Excel :', error);
      alert('Impossible de télécharger le fichier Excel pour la visualisation de la carte.');
    });
  }

  /* visualisation carte pour theme environnement  */
  visualizeEnvironmentDataset(datasetId: number) {
    this.dataSetService.downloadTemplate(datasetId).subscribe((response) => {
      const blob = response.body as Blob;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rows.length === 0) {
          alert('Le fichier Excel est vide.');
          return;
        }

        const headers = rows[0] as string[];
        const villeIndex = headers.indexOf('Lieu');
        if (villeIndex === -1) {
          alert("La colonne 'Lieu' n'a pas été trouvée.");
          return;
        }

        const excelCitiesNames: Set<string> = new Set();
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i] as any[];
          if (row && row.length > villeIndex && row[villeIndex] !== undefined && row[villeIndex] !== null) {
            const cityName = String(row[villeIndex]).trim();
            if (cityName) {
              excelCitiesNames.add(cityName.toLowerCase());
            }
          }
        }

        if (!this.leafletMapComponent) {
          console.error("LeafletMapComponent n'est pas encore disponible.");
          alert("Erreur interne: Le composant de carte n'est pas prêt.");
          return;
        }
        const allCities = this.leafletMapComponent.getAllMoroccanCities();

        this.citiesForMap = allCities.filter(city =>
          excelCitiesNames.has(city.name.toLowerCase())
        ).map(city => ({
          name: city.name,
          coords: [city.coords[0], city.coords[1]] // Crée une nouvelle instance de coordonnées
        }));

        console.log('Villes filtrées pour la carte :', this.citiesForMap); // AJOUTÉ

        const modalElement = document.getElementById('leafletMapModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();

          modalElement.addEventListener('shown.bs.modal', () => {
            if (this.leafletMapComponent) {
              this.leafletMapComponent.initializeMap();
            }
          }, { once: true });
        }
      };
      reader.readAsArrayBuffer(blob);
    }, error => {
      console.error('Erreur lors du téléchargement du fichier Excel :', error);
      alert('Impossible de télécharger le fichier Excel pour la visualisation de la carte.');
    });
  }


  
  // Dans votre composant TypeScript
// Code TypeScript FINAL CORRIGÉ

  apiPreview: any = null;
  
  // Nouvelles propriétés pour les filtres - INITIALISATION SÉCURISÉE
  selectedColumns: string[] = [];
  maxRows: number = 10;
  allColumns: string[] = [];
  filteredData: any = null;

  getExcelAsJsonApi(datasetId: number): void {
    this.dataSetService.downloadTemplate(datasetId).subscribe((response) => {
      const blob = response.body as Blob;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        const columnTitles = Object.keys(jsonData[0] || {});

        // Stocker toutes les données originales
        this.apiPreview = {
          columns: columnTitles,
          rows: jsonData
        };

        // INITIALISATION SÉCURISÉE des filtres
        this.allColumns = [...columnTitles];
        this.selectedColumns = [...columnTitles]; // Toutes les colonnes sélectionnées par défaut
        this.maxRows = Math.min(10, jsonData.length);
        
        console.log('Colonnes initialisées:', this.allColumns);
        console.log('Colonnes sélectionnées:', this.selectedColumns);

      const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      this.jsonApiUrl = URL.createObjectURL(jsonBlob); // 👉 stocke le lien dans une variable du composant


        // Appliquer les filtres initiaux
        this.applyFilters();

        // Ouvrir le modal Bootstrap
        const apiModal = new bootstrap.Modal(document.getElementById('apiModal')!);
        apiModal.show();
      };
      reader.readAsArrayBuffer(blob);
    });
  }

  // Méthode pour appliquer les filtres
  applyFilters(): void {
    if (!this.apiPreview || !this.apiPreview.rows) {
      console.log('Pas de données à filtrer');
      return;
    }

    let filteredRows = [...this.apiPreview.rows];

    // Limiter le nombre de lignes
    if (this.maxRows > 0) {
      filteredRows = filteredRows.slice(0, this.maxRows);
    }

    // Filtrer les colonnes sélectionnées
    if (this.selectedColumns && this.selectedColumns.length > 0) {
      filteredRows = filteredRows.map((row: any) => {
        const filteredRow: any = {};
        this.selectedColumns.forEach(column => {
          if (row.hasOwnProperty(column)) {
            filteredRow[column] = row[column];
          }
        });
        return filteredRow;
      });
    }

    this.filteredData = {
      columns: this.selectedColumns || [],
      rows: filteredRows || []
    };

    console.log('Filtres appliqués:', this.filteredData);
  }

  // NOUVELLE MÉTHODE: Vérifier si une colonne est sélectionnée
  isColumnSelected(column: string): boolean {
    if (!this.selectedColumns || !Array.isArray(this.selectedColumns)) {
      return false;
    }
    return this.selectedColumns.includes(column);
  }

  // NOUVELLE MÉTHODE: Gérer le toggle d'une colonne
  onColumnToggle(column: string, event: any): void {
    // S'assurer que selectedColumns est un tableau
    if (!Array.isArray(this.selectedColumns)) {
      this.selectedColumns = [];
    }
    
    if (event.target.checked) {
      // Ajouter la colonne si elle n'est pas déjà présente
      if (!this.selectedColumns.includes(column)) {
        this.selectedColumns.push(column);
      }
    } else {
      // Retirer la colonne
      const index = this.selectedColumns.indexOf(column);
      if (index > -1) {
        this.selectedColumns.splice(index, 1);
      }
    }
    
    console.log('Colonne toggle:', column, 'Sélectionnées:', this.selectedColumns);
    this.applyFilters();
  }

  // Méthode pour gérer le changement du nombre maximum de lignes
  onMaxRowsChange(): void {
    if (this.maxRows < 1) {
      this.maxRows = 1;
    } else if (this.apiPreview?.rows && this.maxRows > this.apiPreview.rows.length) {
      this.maxRows = this.apiPreview.rows.length;
    }
    this.applyFilters();
  }

  // Méthode pour sélectionner/désélectionner toutes les colonnes
  toggleAllColumns(selectAll: boolean): void {
    if (!Array.isArray(this.allColumns)) {
      console.error('allColumns n\'est pas un tableau');
      return;
    }

    if (selectAll) {
      this.selectedColumns = [...this.allColumns];
    } else {
      this.selectedColumns = [];
    }
    
    console.log('Toggle all:', selectAll, 'Résultat:', this.selectedColumns);
    this.applyFilters();
  }

  // Méthode pour vérifier si toutes les colonnes sont sélectionnées
  areAllColumnsSelected(): boolean {
    if (!Array.isArray(this.selectedColumns) || !Array.isArray(this.allColumns)) {
      return false;
    }
    return this.selectedColumns.length === this.allColumns.length && this.allColumns.length > 0;
  }

  // Méthode pour vérifier si aucune colonne n'est sélectionnée
  areNoColumnsSelected(): boolean {
    if (!Array.isArray(this.selectedColumns)) {
      return true;
    }
    return this.selectedColumns.length === 0;
  }






  jsonApiUrl: string | null = null;

  copyJsonUrl(inputElement: HTMLInputElement): void {
  inputElement.select();
  inputElement.setSelectionRange(0, 99999); // Pour mobile
  navigator.clipboard.writeText(inputElement.value)
    .then(() => {
      console.log('Lien copié dans le presse-papiers');
    })
    .catch((err) => {
      console.error('Erreur lors de la copie', err);
    });
}

}