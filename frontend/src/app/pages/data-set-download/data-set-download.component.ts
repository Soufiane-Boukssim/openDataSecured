import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataSetDownload } from '../../models/DataSetDownload';
import { DataSetDownloadService } from '../../services/dataSetDownload/data-set-download.service';
import { DataSetThemeService } from '../../services/dataSetTheme/data-set-theme.service';
import { FileComponent } from '../../components/file/file.component';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';


declare var bootstrap: any; 

@Component({
  selector: 'app-data-set-download',
  imports: [FormsModule, CommonModule, FileComponent,NgChartsModule],
  templateUrl: './data-set-download.component.html',
  styleUrl: './data-set-download.component.css'
})
export class DataSetDownloadComponent {
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
    dataProviderOrganisationMemberUuid: '', // nouveau champ ajouté
    file: null as File | null
  };
  isUpdating = false;

  tableData: any[][] = [];

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

  // Nouvelle méthode pour ouvrir le modal de mise à jour
  openUpdateModal(dataset: DataSetDownload): void {
    this.selectedDataset = dataset;
    
    // Pré-remplir le formulaire avec les données actuelles
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

  // Méthode appelée quand un fichier est sélectionné
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel') {
        this.updateData.file = file;
      } else {
        alert('Veuillez sélectionner un fichier Excel (.xlsx ou .xls)');
        event.target.value = '';
      }
    }
  }

  // Méthode pour confirmer la mise à jour
  confirmUpdate(): void {
    if (!this.selectedDataset) return;

    this.isUpdating = true;

    // Préparer les données à envoyer
    const name = this.updateData.name !== this.selectedDataset.name ? this.updateData.name : undefined;
    const description = this.updateData.description !== this.selectedDataset.description ? this.updateData.description : undefined;
    const themeUuid = this.updateData.themeUuid !== this.selectedDataset.dataSetTheme.uuid ? this.updateData.themeUuid : undefined;

    this.dataSetService.updateDataset(
      this.selectedDataset.uuid,
      name,
      description,
      themeUuid,
      this.selectedDataset.dataProviderOrganisationMember.uuid, // UUID du membre requis
      this.updateData.file || undefined
    ).subscribe({
      next: (updatedDataset) => {
        console.log('Dataset mis à jour avec succès:', updatedDataset);
        
        // Mettre à jour la liste locale
        const index = this.datasets.findIndex(d => d.uuid === updatedDataset.uuid);
        if (index !== -1) {
          this.datasets[index] = updatedDataset;
          this.applyFilter(); // Réappliquer le filtre
        }

        alert(`Le dataset "${updatedDataset.name}" a été mis à jour avec succès.`);
        
        // Fermer le modal
        const modalElement = document.getElementById('updateModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();
        
        // Réinitialiser les données
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

  // Méthode pour réinitialiser le formulaire de mise à jour
  resetUpdateForm(): void {
    this.updateData = {
      name: '',
      description: '',
      themeUuid: '',
      file: null,
      dataProviderOrganisationMemberUuid: '', // nouveau champ ajouté
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

      // Extraire le nom depuis le header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'template.xlsx';
      if (contentDisposition) {
        const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1];
        }
      }

      // Télécharger le fichier
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

        // Affiche la modal avec bootstrap
        const tableModal = new bootstrap.Modal(document.getElementById('tableModal')!);
        tableModal.show();
      };
      reader.readAsArrayBuffer(blob);
    });
  }





  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data']['datasets'] = [];



  viewAsChart(datasetId: number): void {
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

}