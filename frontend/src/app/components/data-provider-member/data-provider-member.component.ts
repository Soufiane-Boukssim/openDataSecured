import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { DataProviderOrganisationMemberRequest } from '../../models/DataProviderOrganisationMemberRequest';
import { DataProviderOrganisationMemberService } from '../../services/dataProviderOrganisationMember/data-provider-organisation-member.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DataProviderOrganisationRequest } from '../../models/DataProviderOrganisationRequest';


declare var bootstrap: any;

@Component({
  selector: 'app-data-provider-member',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './data-provider-member.component.html',
  styleUrl: './data-provider-member.component.css'
})
export class DataProviderMemberComponent implements OnInit, AfterViewInit {
  searchTerm: string = '';
  members: DataProviderOrganisationMemberRequest[] = [];
  selectedMemberUuid: string | null = null;
  private deleteModal!: Modal;
  selectedMember: DataProviderOrganisationMemberRequest | null = null;
  newMember: Partial<DataProviderOrganisationMemberRequest> = {
    firstName: '',
    lastName: '',
    email: ''
  };

    organisations: DataProviderOrganisationRequest[] = [];  // Pour stocker les organisations


  constructor(private dataProviderOrganisationMemberService: DataProviderOrganisationMemberService, private router: Router) {}

  ngOnInit(): void {
    this.loadMembers();
    this.loadOrganisations();  // Charger les organisations au démarrage

  }

  ngAfterViewInit(): void {
    const deleteModalElement = document.getElementById('deleteConfirmationModal');
    if (deleteModalElement) {
      this.deleteModal = new Modal(deleteModalElement);
    }
  }

  loadMembers(): void {
    this.dataProviderOrganisationMemberService.getAllDataProviderOrganisationMembers().subscribe(data => {
      this.members = data;
    });
  }

    loadOrganisations(): void {
    this.dataProviderOrganisationMemberService.getAllOrganisations().subscribe({
      next: (data) => {
        this.organisations = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des organisations', err);
      }
    });
  }


  get filteredMembers(): DataProviderOrganisationMemberRequest[] {
    if (!this.searchTerm) return this.members;
    return this.members.filter(member =>
      member.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewMember(uuid: string) {
    const found = this.members.find(t => t.uuid === uuid);
    if (found) {
      this.selectedMember = found;
      const modalElement = document.getElementById('memberModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }

  askDeleteMember(uuid: string) {
    this.selectedMemberUuid = uuid;
    this.deleteModal?.show();
  }

  confirmDelete() {
    if (!this.selectedMemberUuid) return;

    this.dataProviderOrganisationMemberService.deleteDataProviderOrganisationMember(this.selectedMemberUuid).subscribe({
      next: () => {
        this.members = this.members.filter(member => member.uuid !== this.selectedMemberUuid);
        this.selectedMemberUuid = null;
        this.deleteModal?.hide();
        console.log('Membre supprimé avec succès');
      },
      error: (err) => {
        console.error('Erreur lors de la suppression', err);
      }
    });
  }

  openUpdateModal(member: DataProviderOrganisationMemberRequest): void {
    this.selectedMember = { ...member }; // clone

    const modalElement = document.getElementById('updateMemberModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  submitUpdate(): void {
    if (!this.selectedMember) return;

    const { uuid, firstName, lastName, email } = this.selectedMember;
    this.dataProviderOrganisationMemberService.updateDataProviderOrganisationMember(uuid, firstName, lastName, email).subscribe({
      next: () => {
        alert('Membre mis à jour avec succès');
        this.loadMembers();

        const modalElement = document.getElementById('updateMemberModal');
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

  // Ouvrir modal d'ajout
  openAddModal(): void {
    this.newMember = { firstName: '', lastName: '', email: '' };
    const modalElement = document.getElementById('addMemberModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Soumission ajout
  submitAdd(): void {
    if (!this.newMember.email) return; // validation basique

    this.dataProviderOrganisationMemberService.addDataProviderOrganisationMember(this.newMember.firstName ?? '', this.newMember.lastName ?? '', this.newMember.email ?? '').subscribe({
      next: (createdMember) => {
        alert('Membre ajouté avec succès');
        this.loadMembers();

        const modalElement = document.getElementById('addMemberModal');
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


  @Input() member: any;
navigateToOrganisation(member: any): void {
    console.log('Membre cliqué :', member);
    if (member?.dataProviderOrganisation?.uuid) {
      this.router.navigate(['/admin/producteurs/organisations'], {
        state: { organisationUuidToView: member.dataProviderOrganisation.uuid } // Renommer la clé pour plus de clarté
      });
    } else {
      console.warn('Impossible de naviguer vers l\'organisation : informations manquantes.');
    }
  }





  // Méthode pour assigner un membre à une organisation
  assignMemberToOrganisation(memberUuid: string, organisationUuid: string): void {
    this.dataProviderOrganisationMemberService.assignUserToOrganisation(organisationUuid, memberUuid).subscribe({
      next: () => {
        alert('Membre assigné avec succès à l\'organisation');
        // Tu peux ici recharger les membres ou faire autre chose
      },
      error: (err) => {
        console.error('Erreur lors de l\'assignation', err);
        alert('Erreur lors de l\'assignation du membre à l\'organisation');
      }
    });
  }

  // Exemple d’appel depuis le template (bouton, etc.)
  onAssignClicked(member: DataProviderOrganisationMemberRequest, organisationUuid: string) {
    if (member.uuid && organisationUuid) {
      this.assignMemberToOrganisation(member.uuid, organisationUuid);
    }
  }


  
}