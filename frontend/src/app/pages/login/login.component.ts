import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        // Rediriger l'utilisateur après une connexion réussie
        console.log('Login successful:', response);
        const token = response.token;
        this.authService.setToken(token);
        this.router.navigate(['/admin/home']);
      },
      (error) => {
        // Gérer l'erreur, afficher un message ou autre
        console.error('Login failed:', error);
        this.errorMessage = 'Login failed: Invalid email or password';
      }
    );
  }
}
