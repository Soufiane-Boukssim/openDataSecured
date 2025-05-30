import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-side-bar',
  imports: [RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  @ViewChild('logoutModalRef') logoutModalRef!: ElementRef;

  // États pour les dropdowns
  isDropdownOpen = false;
  isDropdownMobileOpen = false;
  isProducteursOpen = false;

  constructor(private authService: AuthService) {}

  // Toggle dropdown Producteurs
  toggleProducteurs() {
    this.isProducteursOpen = !this.isProducteursOpen;
  }

  // Toggle dropdown utilisateur (desktop)
  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
    // Fermer l'autre dropdown s'il est ouvert
    this.isDropdownMobileOpen = false;
    console.log('Desktop dropdown toggled:', this.isDropdownOpen);
  }

  // Toggle dropdown utilisateur (mobile)
  toggleDropdownMobile(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDropdownMobileOpen = !this.isDropdownMobileOpen;
    // Fermer l'autre dropdown s'il est ouvert
    this.isDropdownOpen = false;
    console.log('Mobile dropdown toggled:', this.isDropdownMobileOpen);
  }

  // Fermer les dropdowns en cliquant à l'extérieur
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    // Vérifier le dropdown desktop
    const dropdownDesktop = target.closest('.dropdown.dropup:not(.text-center)');
    if (!dropdownDesktop && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }

    // Vérifier le dropdown mobile
    const dropdownMobile = target.closest('.dropdown.dropup.text-center');
    if (!dropdownMobile && this.isDropdownMobileOpen) {
      this.isDropdownMobileOpen = false;
    }

    // Vérifier le toggle Producteurs
    const producteurToggle = target.closest('.btn-toggle');
    if (!producteurToggle && this.isProducteursOpen) {
      this.isProducteursOpen = false;
    }
  }

  // Ouvrir la modal de déconnexion
  openLogoutModal(event: Event) {
    event.preventDefault();
    // Fermer les dropdowns
    this.isDropdownOpen = false;
    this.isDropdownMobileOpen = false;
    
    // Ouvrir la modal
    const modalEl = this.logoutModalRef.nativeElement;
    new Modal(modalEl).show();
  }

  // Fermer la modal de déconnexion
  closeLogoutModal() {
    const modalEl = this.logoutModalRef.nativeElement;
    const modal = Modal.getInstance(modalEl);
    modal?.hide();
  }

  // Confirmer la déconnexion
  confirmLogout() {
    this.authService.logout();
    this.closeLogoutModal();
  }
}