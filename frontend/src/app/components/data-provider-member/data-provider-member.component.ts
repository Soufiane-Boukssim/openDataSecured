import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { DataProviderOrganisationMemberRequest } from '../../models/DataProviderOrganisationMemberRequest';
import { DataProviderOrganisationMemberService } from '../../services/dataProviderOrganisationMember/data-provider-organisation-member.service';
import { RouterModule } from '@angular/router';

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

  constructor(private dataProviderOrganisationMemberService: DataProviderOrganisationMemberService) {}

  ngOnInit(): void {
    this.loadMembers();
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
}