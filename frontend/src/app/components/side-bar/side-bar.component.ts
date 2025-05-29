import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Modal } from 'bootstrap';  // <-- importer Modal ici

@Component({
  selector: 'app-side-bar',
  imports: [RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  @ViewChild('logoutModalRef') logoutModalRef!: ElementRef;

  isDropdownOpen = false;
  isDropdownMobileOpen = false;

  constructor(private authService: AuthService) {}

  toggleDropdown(event: Event) {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleDropdownMobile(event: Event) {
    event.preventDefault();
    this.isDropdownMobileOpen = !this.isDropdownMobileOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    // Grand écran
    const dropdownElement = document.querySelector('.dropdown.dropup');
    if (dropdownElement && !dropdownElement.contains(target)) {
      this.isDropdownOpen = false;
    }

    // Mobile
    const dropdownMobileElement = document.querySelector('.dropdown.dropup.text-center');
    if (dropdownMobileElement && !dropdownMobileElement.contains(target)) {
      this.isDropdownMobileOpen = false;
    }
  }

  openLogoutModal(event: Event) {
    event.preventDefault();
    const modalEl = this.logoutModalRef.nativeElement;
    new Modal(modalEl).show();  // Utilisation de Modal importé
  }

  closeLogoutModal() {
    const modalEl = this.logoutModalRef.nativeElement;
    const modal = Modal.getInstance(modalEl);
    modal?.hide();
  }

  confirmLogout() {
    this.authService.logout();
    this.closeLogoutModal();
  }
}
