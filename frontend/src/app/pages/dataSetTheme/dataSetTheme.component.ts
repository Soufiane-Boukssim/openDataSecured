import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataSetThemeRequest } from '../../models/DataSetThemeRequest';
import { DataSetThemeService } from '../../services/dataSetTheme/data-set-theme.service';
import { Modal } from 'bootstrap';

declare var bootstrap: any;

@Component({
  selector: 'app-dataSetTheme',
  imports: [CommonModule, FormsModule],
  templateUrl: './dataSetTheme.component.html',
  styleUrls: ['./dataSetTheme.component.css']
})

export class DataSetThemeComponent implements AfterViewInit {
  searchTerm: string = '';
  themes: DataSetThemeRequest[] = [];
  selectedThemeUuid: string | null = null;
  private deleteModal!: Modal;
  selectedTheme: DataSetThemeRequest | null = null;

  constructor(private themeService: DataSetThemeService) {}

  ngOnInit(): void {
    this.loadThemes();
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('deleteConfirmationModal');
    if (modalElement) {
      this.deleteModal = new Modal(modalElement);
    }
  }

  loadThemes(): void {
    this.themeService.getThemes().subscribe(data => {
      this.themes = data.map(theme => {
        if (theme.iconData) {
          theme.iconPath = `data:image/png;base64,${theme.iconData}`;
        }
        return theme;
      });
    });
  }

  get filteredThemes(): DataSetThemeRequest[] {
    if (!this.searchTerm) return this.themes;
    return this.themes.filter(theme =>
      theme.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewTheme(uuid: string) {
    const found = this.themes.find(t => t.uuid === uuid);
    if (found) {
      this.selectedTheme = found;
      const modalElement = document.getElementById('themeModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }




  deleteTheme(uuid: string) {
    this.selectedThemeUuid = uuid;
    this.deleteModal?.show();
  }

  confirmDelete() {
    if (!this.selectedThemeUuid) return;

    this.themeService.deleteTheme(this.selectedThemeUuid).subscribe({
      next: () => {
        this.themes = this.themes.filter(theme => theme.uuid !== this.selectedThemeUuid);
        this.selectedThemeUuid = null;
        this.deleteModal?.hide();
        console.log('Thème supprimé avec succès');
      },
      error: (err) => {
        console.error('Erreur lors de la suppression', err);
      }
    });
  }




  //update
    selectedFile: File | null = null;

    openUpdateModal(theme: DataSetThemeRequest): void {
    this.selectedTheme = { ...theme }; // clone
    this.selectedFile = null;

    const modalElement = document.getElementById('updateThemeModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submitUpdate(): void {
    if (!this.selectedTheme) return;

    const { uuid, name, description } = this.selectedTheme;
    this.themeService.updateTheme(uuid, name, description, this.selectedFile!).subscribe({
      next: () => {
        alert('Thème mis à jour avec succès');
        this.loadThemes();

        const modalElement = document.getElementById('updateThemeModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }
      },
      error: (err) => {
        console.error('Erreur update', err);
        alert('Erreur lors de la mise à jour');
      }
    });
  }


  /////////////////////////////////////////////////////////////
newTheme: Partial<DataSetThemeRequest> = {
  name: '',
  description: ''
};


selectedAddFile: File | null = null;

// Ouvrir modal d'ajout
openAddModal(): void {
  this.newTheme = { name: '', description: '' };
  this.selectedAddFile = null;

  const modalElement = document.getElementById('addThemeModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

// Gestion fichier ajout
onAddFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedAddFile = file;
  }
}

// Soumission ajout
submitAdd(): void {
  if (!this.newTheme.name) return; // validation basique

  this.themeService.addTheme(this.newTheme.name, this.newTheme.description ?? '', this.selectedAddFile).subscribe({
    next: (createdTheme) => {
      alert('Thème ajouté avec succès');
      this.loadThemes();

      const modalElement = document.getElementById('addThemeModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
      }
    },
    error: (err) => {
      console.error('Erreur lors de l\'ajout', err);
      alert('Erreur lors de l\'ajout du thème');
    }
  });
}





}