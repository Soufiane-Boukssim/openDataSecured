import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { DataProviderOrganisationRequest } from '../../models/DataProviderOrganisationRequest';
import { DataProviderOrganisationServiceService } from '../../services/dataProviderOrganisation/data-provider-organisation-service.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-data-provider-organisation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-provider-organisation.component.html',
  styleUrls: ['./data-provider-organisation.component.css']
})
export class DataProviderOrganisationComponent implements OnInit, AfterViewInit {
  searchTerm: string = '';
  organisations: DataProviderOrganisationRequest[] = [];
  selectedOrgUuid: string | null = null;
  private deleteModal!: Modal;
  selectedOrganisation: DataProviderOrganisationRequest | null = null;

  selectedFile: File | null = null;
  selectedAddFile: File | null = null;

  newOrganisation: Partial<DataProviderOrganisationRequest> = {
    name: '',
    description: ''
  };

  private organisationUuidToView: string | null = null;

  constructor(private orgService: DataProviderOrganisationServiceService, private router: Router,private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    this.organisationUuidToView = navigation?.extras?.state?.['organisationUuidToView'] as string | null;
  }

  ngOnInit(): void {
    this.loadOrganisations(() => {
      if (this.organisationUuidToView) {
        this.viewOrganisation(this.organisationUuidToView);
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true, state: {} });
      }
    });
  }

  ngAfterViewInit(): void {
    const deleteModalElement = document.getElementById('deleteConfirmationModal');
    if (deleteModalElement) {
      this.deleteModal = new bootstrap.Modal(deleteModalElement);
    }
  }

  loadOrganisations(callback?: () => void): void {
    this.orgService.getProviderOrganisations().subscribe(data => {
      this.organisations = data.map(org => {
        if (org.iconData) {
          org.iconPath = `data:image/png;base64,${org.iconData}`;
        }
        return org;
      });
      if (callback) {
        callback();
      }
    });
  }

  get filteredOrganisations(): DataProviderOrganisationRequest[] {
    if (!this.searchTerm) return this.organisations;
    return this.organisations.filter(org =>
      org.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewOrganisation(uuid: string) {
    const found = this.organisations.find(org => org.uuid === uuid);
    if (found) {
      this.selectedOrganisation = found;
      const viewModalElement = document.getElementById('viewOrganisationModal');
      if (viewModalElement) {
        const viewModal = new bootstrap.Modal(viewModalElement);
        viewModal.show();
      }
    }
  }

  // Delete
  deleteOrganisation(uuid: string): void {
    this.selectedOrgUuid = uuid;
    this.deleteModal?.show();
  }

  confirmDelete(): void {
    if (!this.selectedOrgUuid) return;
    this.orgService.deleteProviderOrganisation(this.selectedOrgUuid).subscribe({
      next: () => {
        this.organisations = this.organisations.filter(org => org.uuid !== this.selectedOrgUuid);
        this.selectedOrgUuid = null;
        this.deleteModal?.hide();
        console.log('Organisation supprimée avec succès');
      },
      error: err => {
        console.error('Erreur lors de la suppression', err);
      }
    });
  }

  // Update
  openUpdateModal(org: DataProviderOrganisationRequest): void {
    this.selectedOrganisation = { ...org };
    this.selectedFile = null;
    const updateModalElement = document.getElementById('updateOrganisationModal');
    if (updateModalElement) {
      const updateModal = new bootstrap.Modal(updateModalElement);
      updateModal.show();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  updateOrganisation(): void {
    if (!this.selectedOrganisation) return;

    const { uuid, name, description } = this.selectedOrganisation;
    this.orgService.updateProviderOrganisation(uuid, name, description, this.selectedFile!).subscribe({
      next: () => {
        alert('Organisation mise à jour avec succès');
        this.loadOrganisations();
        const updateModalElement = document.getElementById('updateOrganisationModal');
        if (updateModalElement) {
          const updateModal = bootstrap.Modal.getInstance(updateModalElement);
          updateModal?.hide();
        }
      },
      error: err => {
        console.error('Erreur update', err);
        alert('Erreur lors de la mise à jour');
      }
    });
  }

  // Add
  openAddModal(): void {
    this.newOrganisation = { name: '', description: '' };
    this.selectedAddFile = null;
    const addModalElement = document.getElementById('addOrganisationModal');
    if (addModalElement) {
      const addModal = new bootstrap.Modal(addModalElement);
      addModal.show();
    }
  }

  onAddFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedAddFile = file;
    }
  }

  addOrganisation(): void {
    if (!this.newOrganisation.name) return;
    this.orgService.addProviderOrganisation(this.newOrganisation.name, this.newOrganisation.description ?? '', this.selectedAddFile).subscribe({
      next: () => {
        alert('Organisation ajoutée avec succès');
        this.loadOrganisations();
        const addModalElement = document.getElementById('addOrganisationModal');
        if (addModalElement) {
          const addModal = bootstrap.Modal.getInstance(addModalElement);
          addModal?.hide();
        }
      },
      error: err => {
        console.error('Erreur lors de l\'ajout', err);
        alert('Erreur lors de l\'ajout de l\'organisation');
      }
    });
  }
}