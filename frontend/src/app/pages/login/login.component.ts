import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  // Utiliser inject() au lieu du constructeur pour éviter les problèmes d'injection
  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        const token = response.token;
        this.authService.setToken(token);
        this.router.navigate(['/admin/home']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Login failed: Invalid email or password';
      }
    });
  }
}