import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { DataProviderOrganisationMemberRequest } from '../../models/DataProviderOrganisationMemberRequest';
import { DataProviderOrganisationMemberService } from '../../services/dataProviderOrganisationMember/data-provider-organisation-member.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DataProviderOrganisationRequest } from '../../models/DataProviderOrganisationRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';


declare var bootstrap: any;

@Component({
  selector: 'app-data-provider-member',
  imports: [CommonModule, FormsModule, RouterModule],
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
  organisations: DataProviderOrganisationRequest[] = [];
  assignMode: boolean = false;
  selectedOrganisationId: string | null = null;


  constructor(private dataProviderOrganisationMemberService: DataProviderOrganisationMemberService, private router: Router, private authService: AuthService, private organisationService:DataProviderOrganisationMemberService) { }

  userRole: string | null = null;

  ngOnInit(): void {
    this.loadMembers();
    this.loadOrganisations();
  }

  ngAfterViewInit(): void {
    const deleteModalElement = document.getElementById('deleteConfirmationModal');
    if (deleteModalElement) {
      this.deleteModal = new Modal(deleteModalElement);
    }
  }

loadMembers(): void {
  this.userRole = this.authService.getUserRole();

  if (this.userRole === 'ROLE_ADMIN') {
    this.dataProviderOrganisationMemberService.getAllDataProviderOrganisationMembers().subscribe(data => {
      this.members = data;  // affiche tout
    });
  } else if (this.userRole === 'ROLE_PROVIDER') {
    this.organisationService.getOrganisationOfCurrentProvider().subscribe({
      next: (org) => {
        this.dataProviderOrganisationMemberService.getAllDataProviderOrganisationMembers().subscribe(members => {
          if (!org) {
            // Pas d'organisation => afficher uniquement le membre connecté
            const email = this.authService.getUserEmail(); // méthode que tu peux créer dans AuthService
            this.members = members.filter(m => m.email === email);
          } else {
            // Organisation existante => afficher les membres de la même organisation
            this.members = members.filter(member =>
              member.dataProviderOrganisation?.uuid === org.uuid
            );
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l’organisation du provider :', err);
        this.members = [];
      }
    });
  }
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
      this.assignMode = false; // Ensure the details view is shown
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


  navigateToOrganisationFromModal(member: any) {
    // D'abord fermer la modale actuelle
    const modal = document.getElementById('memberModal');
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();

    // Ensuite naviguer vers l'organisation
    setTimeout(() => {
      this.navigateToOrganisation(member);
    }, 150); // Petit délai pour s'assurer que la modale est bien fermée
  }


  openAssignOrganisationModal(member: DataProviderOrganisationMemberRequest): void {
    this.selectedMember = member;
    this.assignMode = true;
    this.selectedOrganisationId = null; // Reset the selected organisation

    const modalElement = document.getElementById('memberModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }


assignOrganisationToMember(): void {
  if (this.selectedMember?.uuid && this.selectedOrganisationId) {
    const prenom = this.selectedMember.firstName;
    const nom = this.selectedMember.lastName;

    this.dataProviderOrganisationMemberService.assignUserToOrganisation(this.selectedOrganisationId, this.selectedMember.uuid).subscribe({
      next: (response: string) => {
        // Fermer la modal Bootstrap directement
        const modalElement = document.getElementById('memberModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }

        setTimeout(() => {
          this.closeMemberModal(false);
          alert(`Membre ${prenom} ${nom} assigné avec succès à l'organisation.`);
          this.selectedMember = null;
          this.assignMode = false;
          this.loadMembers();
        }, 300);
      },
      error: (err: HttpErrorResponse) => {
        let errorMessage = 'Erreur lors de l\'assignation.';
        if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.error) {
          errorMessage = JSON.stringify(err.error);
        }

        // Même fermeture ici aussi
        const modalElement = document.getElementById('memberModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }

        setTimeout(() => {
          alert(errorMessage);
          this.selectedMember = null;
          this.assignMode = false;
        }, 300);
      }
    });
  }
}





closeMemberModal(reset: boolean = true): void {
  const modalElement = document.getElementById('updateMemberModal');  // <-- ici
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
      setTimeout(() => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();

        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }, 200);
    }

    if (reset) {
      this.assignMode = false;
      this.selectedMember = null;
    }
  }
}

canEditMember(member: DataProviderOrganisationMemberRequest): boolean {
  // Si l'utilisateur est ADMIN, il peut tout faire
  if (this.userRole === 'ROLE_ADMIN') {
    return true;
  }
  
  // Si l'utilisateur est PROVIDER, il ne peut éditer que son propre compte
  if (this.userRole === 'ROLE_PROVIDER') {
    const currentUserEmail = this.authService.getUserEmail();
    return member.email === currentUserEmail;
  }
  
  // Pour les autres rôles, pas d'édition
  return false;
}



}