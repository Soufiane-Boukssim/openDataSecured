import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DataProviderOrganisationMemberService } from '../../services/dataProviderOrganisationMember/data-provider-organisation-member.service';
import { catchError, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  private memberService = inject(DataProviderOrganisationMemberService);
  private authService = inject(AuthService);
  private router = inject(Router);

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  onSubmit(): void {
    const signupRequest = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      role: 'ROLE_PROVIDER'
    };

    this.authService.register(signupRequest).pipe(
      switchMap(() => {
        // ⏩ On enchaîne avec le login dès que le register réussit
        return this.authService.login(this.email, this.password);
      }),
      switchMap(() => {
        // ⏩ Puis on enchaîne avec l'ajout du membre (le token est bien stocké ici)
        return this.memberService.addDataProviderOrganisationMember(
          this.firstName,
          this.lastName,
          this.email
        );
      }),
      catchError(err => {
        console.error('Erreur pendant le processus :', err);
        this.errorMessage = 'Une erreur est survenue pendant l\'inscription.';
        this.authService.logout();
        this.router.navigate(['/login']);
        return of(null); // pour terminer le flux proprement
      })
    ).subscribe({
      next: (result) => {
        if (result !== null) {
          console.log('Tout est réussi, redirection vers /home');
          this.router.navigate(['/home']);
        }
      }
    });
  }
}
